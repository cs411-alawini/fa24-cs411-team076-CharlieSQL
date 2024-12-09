import { UserInfo, CountryInfo, ConditionsInfo, LifestyleInfo, BiometricsInfo } from '../models/dataTypes';
import pool from './connections';
import { RowDataPacket } from 'mysql2';


const advQuery1 = `
SELECT u.User_Id, u.Age, b.BMI, b.HbA1c, u.Diagnosis
FROM USERINFO u
JOIN LIFESTYLEINFO l ON u.User_Id = l.User_Id
JOIN BIOMETRICSINFO b ON u.User_Id = b.User_Id
WHERE l.Smoker = 0
AND EXISTS (
  SELECT 1 
  FROM CONDITIONSINFO c
  WHERE c.User_Id = u.User_Id
  AND (c.HighBP = 1 OR c.HeartDisease = 1)
);
`;
const advQuery2 = `
SELECT 
  FLOOR(u.Age / 10) * 10 AS Age_Range_Start,
  COUNT(u.User_Id) AS User_Count,
  AVG(b.BMI) AS Avg_BMI,
  AVG(b.HbA1c) AS Avg_HbA1c
FROM USERINFO u
JOIN BIOMETRICSINFO b ON u.User_Id = b.User_Id
JOIN LIFESTYLEINFO l ON u.User_Id = l.User_Id
WHERE l.Smoker= 0 
GROUP BY Age_Range_Start
ORDER BY Age_Range_Start
`;
const advQuery3 = `
SELECT L.Veggies, L.Fruits, AVG(B.BMI) AS average_BMI, AVG(B.HbA1c) AS average_HbA
FROM BIOMETRICSINFO B
JOIN LIFESTYLEINFO L ON B.User_Id = L.User_Id
GROUP BY L.Veggies, L.Fruits
ORDER BY average_BMI DESC;
`;
const advQuery4 = `
SELECT ui.Diagnosis, COUNT(*) AS count_users, AVG(bi.BMI) AS average_bmi, AVG(bi.BloodGlucose) AS average_blood_glucose 
FROM USERINFO ui
JOIN BIOMETRICSINFO bi ON bi.User_Id = ui.User_Id 
GROUP BY ui.Diagnosis
ORDER BY count_users ASC;
`;
// describe type and map to use in create/update table functions
type InfoTableEnum = 'BIOMETRICSINFO' | 'CONDITIONSINFO' | 'LIFESTYLEINFO';
const entryDateMap: { [key in InfoTableEnum]: string } = {
    BIOMETRICSINFO: 'BioEntryDate',
    CONDITIONSINFO: 'CondEntryDate',
    LIFESTYLEINFO: 'LifeEntryDate'
};
const tupleMap: { [key in InfoTableEnum]: string } = {
    BIOMETRICSINFO: '(BMI, HbA1c, BloodGlucose)',
    CONDITIONSINFO: '(Stroke, HighChol, HighBP, HeartDisease, Hypertension)',
    LIFESTYLEINFO: '(Smoker, CheckChol, Fruits, Veggies)'
};



// example function to demonstrate MySQL connection
export async function getAllUsers(): Promise<UserInfo[] | null> {
    const queryString = 'SELECT * FROM diabetes.USERINFO LIMIT 20';
    try {
        const [rows] = await pool.query(queryString);
        return rows as UserInfo[];
    } catch (error) {
        console.error('Error executing query', error);
    }
    return null;
};

// example function to demonstrate MySQL connection
export async function getUserBiometrics(): Promise<BiometricsInfo[] | null> {
    const queryString = 'SELECT * FROM diabetes.BIOMETRICSINFO LIMIT 20';
    try {
        const [rows] = await pool.query(queryString);
        return rows as BiometricsInfo[];
    } catch (error) {
        console.error('Error executing query', error);
    }
    return null;
};

// requires form to filled with relevant information on frontend before being called
// implementing adding a new user to USERINFO table, part of CRUD functionality
export async function createUser(age: number, gender: string, country: string, diagnosis: string): Promise<UserInfo[] | null> {
    // Get the current max User_Id
    const [result] = await pool.query('SELECT MAX(User_Id) as maxId FROM diabetes.USERINFO');
    const maxId = (result as any)[0].maxId || 0;  // If no users exist, start at 0
    const newUserId = maxId + 1;
    
    console.log(`Attempting to create new user with User_Id ${newUserId}`);
    
    // Use proper string quotes for string values in the SQL query
    const queryString = `INSERT INTO diabetes.USERINFO (User_Id, Age, Gender, Country, Diagnosis) 
        VALUES (${newUserId}, ${age}, '${gender}', '${country}', '${diagnosis}')`;
    
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new user: query execution failure', error);
        console.error('Query string was:', queryString);
    }
    
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.USERINFO WHERE User_Id = ${newUserId}`);
    return confirmation as UserInfo[];
};
/* Functions below are to handle creating new entries for biometrics, conditions, lifestyle depending on which form user fills
These functions assume all relevant tuple values are filled, and handled in the frontend before being called */
export async function updateDailyBioInfo(pool: any, user: number, date: string, BMI?: number, HbA1c?: number, BloodGlucose?: number): Promise<BiometricsInfo[] | null> {
    // const [result] = await pool.query('SELECT MAX(BioEntryDate) as maxDate FROM diabetes.BIOMETRICSINFO WHERE User_Id = ?', [user]);
    // const lastUpdateDate = (result as any)[0].maxDate;
    // let queryString = "";

    // // Format both dates to YYYY-MM-DD for comparison
    // const formattedLastDate = lastUpdateDate ? new Date(lastUpdateDate).toISOString().slice(0, 10) : null;
    // const formattedCurrentDate = new Date(date).toISOString().slice(0, 10);

    // if (formattedLastDate === formattedCurrentDate) {
    //     queryString = `UPDATE diabetes.BIOMETRICSINFO SET BMI = ${BMI}, HbA1c = ${HbA1c}, BloodGlucose = ${BloodGlucose} WHERE User_Id = ${user} AND BioEntryDate = '${date}'`;
    //     console.log("Updating BIOMETRICSINFO tuple");
    // } else {
    //     queryString = `INSERT INTO diabetes.BIOMETRICSINFO (User_Id, BioEntryDate, BMI, HbA1c, BloodGlucose) VALUES (${user}, '${date}', ${BMI}, ${HbA1c}, ${BloodGlucose})`;
    //     console.log("Creating BIOMETRICSINFO tuple");
    // }
    let queryString = `
      INSERT INTO diabetes.BIOMETRICSINFO (User_Id, BioEntryDate, BMI, HbA1c, BloodGlucose) 
      VALUES (${user}, '${date}', ${BMI}, ${HbA1c}, ${BloodGlucose}) 
      ON DUPLICATE KEY UPDATE 
        BMI = VALUES(BMI),
        HbA1c = VALUES(HbA1c),
        BloodGlucose = VALUES(BloodGlucose)`;
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new daily info: query execution failure', error);
        console.error('Query string was:', queryString);
        return null;
    }
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.BIOMETRICSINFO WHERE User_Id = ${user} AND BioEntryDate = '${date}'`);
    return confirmation as BiometricsInfo[];
}

export async function updateDailyCondInfo(pool: any, user: number, date: string, Stroke?: number, HighChol?: number, HighBP?: number, HeartDisease?: number, Hypertension?: number): Promise<ConditionsInfo[] | null> {
    // const [result] = await pool.query('SELECT MAX(CondEntryDate) as maxDate FROM diabetes.CONDITIONSINFO WHERE User_Id = ?', [user]);
    // const lastUpdateDate = (result as any)[0].maxDate;
    // let queryString = "";

    // const formattedLastDate = lastUpdateDate ? new Date(lastUpdateDate).toISOString().slice(0, 10) : null;
    // const formattedCurrentDate = new Date(date).toISOString().slice(0, 10);

    // if (formattedLastDate === formattedCurrentDate) {
    //     queryString = `UPDATE diabetes.CONDITIONSINFO SET Stroke = ${Stroke}, HighChol = ${HighChol}, HighBP = ${HighBP}, HeartDisease = ${HeartDisease}, Hypertension = ${Hypertension} WHERE User_Id = ${user} AND CondEntryDate = '${date}'`;
    //     console.log("Updating CONDITIONSINFO tuple");
    // } else {
    //     queryString = `INSERT INTO diabetes.CONDITIONSINFO (User_Id, CondEntryDate, Stroke, HighChol, HighBP, HeartDisease, Hypertension) VALUES (${user}, '${date}', ${Stroke}, ${HighChol}, ${HighBP}, ${HeartDisease}, ${Hypertension})`;
    //     console.log("Creating CONDITIONSINFO tuple");
    // }
    let queryString = `
      INSERT INTO diabetes.CONDITIONSINFO (User_Id, CondEntryDate, Stroke, HighChol, HighBP, HeartDisease, Hypertension) 
      VALUES (${user}, '${date}', ${Stroke}, ${HighChol}, ${HighBP}, ${HeartDisease}, ${Hypertension}) 
      ON DUPLICATE KEY UPDATE 
        Stroke = VALUES(Stroke),
        HighChol = VALUES(HighChol),
        HighBP = VALUES(HighBP),
        HeartDisease = VALUES(HeartDisease),
        Hypertension = VALUES(Hypertension)`;
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new daily info: query execution failure', error);
        console.error('Query string was:', queryString);
        return null;
    }
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.CONDITIONSINFO WHERE User_Id = ${user} AND CondEntryDate = '${date}'`);
    return confirmation as ConditionsInfo[];
}

export async function updateDailyLifeInfo(pool: any, user: number, date: string, Smoker?: number, CheckChol?: number, Fruits?: number, Veggies?: number): Promise<LifestyleInfo[] | null> {
    // const [result] = await pool.query('SELECT MAX(LifeEntryDate) as maxDate FROM diabetes.LIFESTYLEINFO WHERE User_Id = ?', [user]);
    // const lastUpdateDate = (result as any)[0].maxDate;
    // let queryString = "";

    // const formattedLastDate = lastUpdateDate ? new Date(lastUpdateDate).toISOString().slice(0, 10) : null;
    // const formattedCurrentDate = new Date(date).toISOString().slice(0, 10);

    // if (formattedLastDate === formattedCurrentDate) {
    //     queryString = `UPDATE diabetes.LIFESTYLEINFO SET Smoker = ${Smoker}, CheckChol = ${CheckChol}, Fruits = ${Fruits}, Veggies = ${Veggies} WHERE User_Id = ${user} AND LifeEntryDate = '${date}'`;
    //     console.log("Updating LIFESTYLEINFO tuple");
    // } else {
    //     queryString = `INSERT INTO diabetes.LIFESTYLEINFO (User_Id, LifeEntryDate, Smoker, CheckChol, Fruits, Veggies) VALUES (${user}, '${date}', ${Smoker}, ${CheckChol}, ${Fruits}, ${Veggies})`;
    //     console.log("Creating LIFESTYLEINFO tuple");
    // }
    let queryString = `
      INSERT INTO diabetes.LIFESTYLEINFO (User_Id, LifeEntryDate, Smoker, CheckChol, Fruits, Veggies) 
      VALUES (${user}, '${date}', ${Smoker}, ${CheckChol}, ${Fruits}, ${Veggies}) 
      ON DUPLICATE KEY UPDATE 
        Smoker = VALUES(Smoker),
        CheckChol = VALUES(CheckChol),
        Fruits = VALUES(Fruits),
        Veggies = VALUES(Veggies)`;
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new daily info: query execution failure', error);
        console.error('Query string was:', queryString);
        return null;
    }
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.LIFESTYLEINFO WHERE User_Id = ${user} AND LifeEntryDate = '${date}'`);
    return confirmation as LifestyleInfo[];
}

// Function to handle user deletion, part of CRUD functionality
export async function deleteUser(userId: number): Promise<void> {
    const queryString = `DELETE FROM diabetes.USERINFO WHERE User_Id = ${userId}`;
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error(`Error deleting user ${userId}: query execution failure`, error);
    }
}

export async function updateUser(userId: number, age?: number, gender?: string, country?: string, diagnosis?: string): Promise<UserInfo[] | null> {
  console.log(`Attempting to update user with User_Id ${userId}`);
  
  // Build the SET clause dynamically based on provided fields
  const updates: string[] = [];
  if (age !== undefined) updates.push(`Age = ${age}`);
  if (gender !== undefined) updates.push(`Gender = '${gender}'`);
  if (country !== undefined) updates.push(`Country = '${country}'`);
  if (diagnosis !== undefined) updates.push(`Diagnosis = '${diagnosis}'`);
  
  if (updates.length === 0) return null; // No fields to update
  
  const queryString = `UPDATE diabetes.USERINFO SET ${updates.join(', ')} WHERE User_Id = ${userId}`;
  
  try {
    await pool.query(queryString);
  } catch (error) {
    console.error('Error updating user: query execution failure', error);
    return null;
  }
  
  let [confirmation] = await pool.query(`SELECT * FROM diabetes.USERINFO WHERE User_Id = ${userId}`);
  return confirmation as UserInfo[];
}

export async function checkUserExists(userId: number): Promise<boolean> {
    try {
        const [result] = await pool.query(
            'SELECT COUNT(*) as count FROM diabetes.USERINFO WHERE User_Id = ?',
            [userId]
        );
        return (result as any)[0].count > 0;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}

// Add new transaction functions
// Query to make use of first transaction
export async function updateBiometricsWithRiskAlerts(
  userId: number,
  date: string,
  bmi?: number,  // BIOMETRICSINFO attributes
  hba1c?: number,
  bloodGlucose?: number,
  heartDisease?: number, // CONDITIONSINFO attributes
  stroke?: number,
  highChol?: number,
  highBP?: number, 
  hypertension?: number
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const confirmBioUpdate = await updateDailyBioInfo(connection, userId, date, bmi, hba1c, bloodGlucose);
    const confirmCondUpdate = await updateDailyCondInfo(connection, userId, date, stroke, highChol, highBP, heartDisease, hypertension);
    if (!confirmBioUpdate || !confirmCondUpdate) {
      throw new Error('Failed to update biometrics or conditions info');
    }
    // await connection.query(
    //   'UPDATE BIOMETRICSINFO SET BMI = ?, HbA1c = ?, BloodGlucose = ? WHERE User_Id = ?',
    //   [bmi, hba1c, bloodGlucose, userId]
    // );

    await connection.query(`
      INSERT INTO RiskAlerts (User_Id, Alert_Message, Created_On)
      SELECT DISTINCT u.User_Id, 
        'Elevated risk detected: Review health conditions and consult your physician.', 
        NOW()
      FROM USERINFO u
      JOIN BIOMETRICSINFO b ON u.User_Id = b.User_Id
      JOIN CONDITIONSINFO c ON u.User_Id = c.User_Id
      WHERE u.User_Id = ? 
      AND (b.BMI > 30 
        OR b.HbA1c > 6.4 
        OR b.BloodGlucose > 125 
        OR c.HeartDisease = 1 
        OR c.HighBP = 1)`,
      [userId]
    );

    await connection.query(
      'INSERT INTO UpdateLog (User_Id, Updated_On, Update_Reason) VALUES (?, NOW(), ?)',
      [userId, 'Daily biometrics update with risk evaluation']
    );

    await connection.commit();
  } catch (error) {
    console.log(349, "Biometrics and Conditions transaction failed");
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
// Query to make use of second transaction
export async function updateLifestyleWithRewards(
  userId: number,
  date: string,
  veggies?: number,
  fruits?: number,
  smoker?: number,
  checkChol?: number
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const confirmLifeUpdate = await updateDailyLifeInfo(connection, userId, date, smoker, checkChol, fruits, veggies);
    if (!confirmLifeUpdate) {
      throw new Error('Failed to update lifestyle info');
    }
    // await connection.query(
    //   'UPDATE LIFESTYLEINFO SET Veggies = ?, Fruits = ?, Smoker = ?, CheckChol = ? WHERE User_Id = ?',
    //   [veggies, fruits, smoker, checkChol, userId]
    // );

    await connection.query(`
      INSERT INTO Incentives (User_Id, Incentive_Description, Granted_On)
      SELECT DISTINCT l1.User_Id, 'Healthy Lifestyle Reward', NOW()
      FROM LIFESTYLEINFO l1
      JOIN LIFESTYLEINFO l2 ON l1.User_Id = l2.User_Id
      WHERE l1.User_Id = ?
      AND l1.LifeEntryDate = ?
      AND l2.LifeEntryDate < l1.LifeEntryDate
      AND (l1.Veggies > l2.Veggies 
        OR l1.Fruits > l2.Fruits 
        OR l1.CheckChol > l2.CheckChol 
        OR l1.Smoker < l2.Smoker)
      ORDER BY l2.LifeEntryDate DESC
      LIMIT 1`,
      [userId, date]
    );

    await connection.query(
      'INSERT INTO UpdateLog (User_Id, Updated_On, Update_Reason) VALUES (?, NOW(), ?)',
      [userId, 'Lifestyle update and improvement evaluation']
    );

    await connection.commit();
  } catch (error) {
    console.log(402, "Lifestyle and Incentives transaction failed");
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
// Queries to make use of stored procedures
export async function getDoctorView(): Promise<RowDataPacket[] | null> {
    let queryString = "CALL GetAgeRangeStats()"
    try {
        const [rows] = await pool.query(queryString);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error executing advanced query', error);
    }
    return null;
}
export async function getHighRiskPatients(): Promise<RowDataPacket[] | null> {
    let queryString = "CALL GetHighRiskPatients()"
    try {
        const [rows] = await pool.query(queryString);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error executing advanced query', error);
    }
    return null;
}

export async function getUserEntryInfo(userId: number, type: string, date: string): Promise<RowDataPacket[] | null> {
    const typeMap: { [key: string]: string } = {
        'biometrics': 'BioEntryDate',
        'conditions': 'CondEntryDate',
        'lifestyle': 'LifeEntryDate'
    }
    const tableMap: { [key: string]: string } = {
        'biometrics': 'BIOMETRICSINFO',
        'conditions': 'CONDITIONSINFO',
        'lifestyle': 'LIFESTYLEINFO'
    }
    let queryString = `
    SELECT * 
    FROM diabetes.${tableMap[type]}
    WHERE User_Id = ${userId} AND ${typeMap[type]} <= '${date}'
    ORDER BY ${typeMap[type]} DESC
    LIMIT 5`;
    try {
        const [rows] = await pool.query(queryString);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error querying for user daily entries', error);
    }
    return null;
}
export async function getUserLogs(userId: number): Promise<RowDataPacket[] | null> {
    let queryString = `
    SELECT * 
    FROM diabetes.UpdateLog
    WHERE User_Id = ${userId}
    ORDER BY Log_Id DESC, Updated_On DESC
    LIMIT 5`;
    try {
        const [rows] = await pool.query(queryString);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error querying for user update logs', error);
    }
    return null;
}
export async function getUserRiskAlerts(userId: number): Promise<RowDataPacket[] | null> {
    let queryString = `
    SELECT *
    FROM diabetes.RiskAlerts
    WHERE User_Id = ${userId}
    ORDER BY Alert_Id DESC, Created_On DESC
    LIMIT 5`;
    try {
        const [rows] = await pool.query(queryString);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error querying for user risk alerts', error);
    }
    return null;
}
export async function getUserIncentives(userId: number): Promise<RowDataPacket[] | null> {
    let queryString = `
    SELECT *
    FROM diabetes.Incentives
    WHERE User_Id = ${userId}
    ORDER BY Incentive_Id DESC, Granted_On DESC
    LIMIT 5`;
    try {
        const [rows] = await pool.query(queryString);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error querying for user incentives', error);
    }
    return null;
}
export async function getUserDiagnosis(userId: number): Promise<RowDataPacket[] | null> {
    let queryString = `SELECT Diagnosis FROM diabetes.USERINFO WHERE User_Id = ${userId}`;
    try {
        const [rows] = await pool.query(queryString);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error querying for user diagnosis', error);
    }
    return null;
}
