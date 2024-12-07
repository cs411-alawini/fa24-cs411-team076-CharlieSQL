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
    let currUserId = await pool.query('SELECT MAX(User_Id) FROM diabetes.USERINFO');
    let newUserId = currUserId[0] as unknown as number + 1;
    console.log(`Attempting to create new user with User_Id ${newUserId}`);
    const queryString = `INSERT INTO diabetes.USERINFO (${newUserId}, ${age}, ${gender}, ${country}, ${diagnosis})`;
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new user: query execution failure', error);
        return null; // finish executing early if failure
    }
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.USERINFO WHERE User_Id = ${newUserId}`);
    return confirmation as UserInfo[];
};
/* Functions below are to handle creating new entries for biometrics, conditions, lifestyle depending on which form user fills
These functions assume all relevant tuple values are filled, and handled in the frontend before being called */
export async function updateDailyBioInfo(user: number, date: Date, BMI: number, HbA1c: number, BloodGlucose: number): Promise<BiometricsInfo[] | null> {
    let lastUpdateDate = await pool.query(`SELECT MAX(BioEntryDate) FROM diabetes.BIOMETRICSINFO WHERE User_Id = ${user}`);
    let queryString = "";
    if (lastUpdateDate[0] as unknown as Date === date) {
        queryString = `UPDATE diabetes.BIOMETRICSINFO SET BMI = ${BMI}, HbA1c = ${HbA1c}, BloodGlucose = ${BloodGlucose} WHERE User_Id = ${user} AND BioEntryDate = ${date}`;
        console.log("Updating BIOMETRICSINFO tuple");
    } else {
        queryString = `INSERT INTO diabetes.BIOMETRICSINFO (User_Id, BioEntryDate, BMI, HbA1c, BloodGlucose) VALUES (${user}, ${date}, ${BMI}, ${HbA1c}, ${BloodGlucose})`;
        console.log("Creating BIOMETRICSINFO tuple");
    }
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new daily info: query execution failure', error);
        return null;
    }
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.BIOMETRICSINFO WHERE User_Id = ${user} AND BioEntryDate = ${date}`);
    return confirmation as BiometricsInfo[];
}

export async function updateDailyCondInfo(user: number, date: Date, Stroke: number, HighChol: number, HighBP: number, HeartDisease: number, Hypertension: number): Promise<ConditionsInfo[] | null> {
    let lastUpdateDate = await pool.query(`SELECT MAX(CondEntryDate) FROM diabetes.CONDITIONSINFO WHERE User_Id = ${user}`);
    let queryString = "";
    if (lastUpdateDate[0] as unknown as Date === date) {
        queryString = `UPDATE diabetes.CONDITIONSINFO SET Stroke = ${Stroke}, HighChol = ${HighChol}, HighBP = ${HighBP}, HeartDisease = ${HeartDisease}, Hypertension = ${Hypertension} WHERE User_Id = ${user} AND CondEntryDate = ${date}`;
        console.log("Updating CONDITIONSINFO tuple");
    } else {
        queryString = `INSERT INTO diabetes.CONDITIONSINFO (User_Id, CondEntryDate, Stroke, HighChol, HighBP, HeartDisease, Hypertension) VALUES (${user}, ${date}, ${Stroke}, ${HighChol}, ${HighBP}, ${HeartDisease}, ${Hypertension})`;
        console.log("Creating CONDITIONSINFO tuple");
    }
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new daily info: query execution failure', error);
        return null;
    }
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.CONDITIONSINFO WHERE User_Id = ${user} AND CondEntryDate = ${date}`);
    return confirmation as ConditionsInfo[];
}

export async function updateDailyLifeInfo(user: number, date: Date, Smoker: number, CheckChol: number, Fruits: number, Veggies: number): Promise<LifestyleInfo[] | null> {
    let lastUpdateDate = await pool.query(`SELECT MAX(LifeEntryDate) FROM diabetes.CONDITIONSINFO WHERE User_Id = ${user}`);
    let queryString = "";
    if (lastUpdateDate[0] as unknown as Date === date) {
        queryString = `UPDATE diabetes.LIFESTYLEINFO SET Smoker = ${Smoker}, CheckChol = ${CheckChol}, Fruits = ${Fruits}, Veggies = ${Veggies} WHERE User_Id = ${user} AND LifeEntryDate = ${date}`;
        console.log("Updating LIFESTYLEINFO tuple");
    } else {
        queryString = `INSERT INTO diabetes.LIFESTYLEINFO (User_Id, LifeEntryDate, Smoker, CheckChol, Fruits, Veggies) VALUES (${user}, ${date}, ${Smoker}, ${CheckChol}, ${Fruits}, ${Veggies})`;
        console.log("Creating LIFESTYLEINFO tuple");
    }
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error('Error creating new daily info: query execution failure', error);
        return null;
    }
    let [confirmation] = await pool.query(`SELECT * FROM diabetes.LIFESTYLEINFO WHERE User_Id = ${user} AND LifeEntryDate = ${date}`);
    return confirmation as LifestyleInfo[];
}

// Functions to handle advanced queries, implementing read part of CRUD functionality
export async function getQuery1(): Promise<RowDataPacket[] | null> {
    try {
        const [rows] = await pool.query(advQuery1);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error executing advanced query', error);
    }
    return null;
};
export async function getQuery2(): Promise<RowDataPacket[] | null> {
    try {
        const [rows] = await pool.query(advQuery2);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error executing advanced query', error);
    }
    return null;
};
export async function getQuery3(): Promise<RowDataPacket[] | null> {
    try {
        const [rows] = await pool.query(advQuery3);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error executing advanced query', error);
    }
    return null;
};
export async function getQuery4(): Promise<RowDataPacket[] | null> {
    try {
        const [rows] = await pool.query(advQuery4);
        return rows as RowDataPacket[];
    } catch (error) {
        console.error('Error executing advanced query', error);
    }
    return null;
};

// Function to handle user deletion, part of CRUD functionality
export async function deleteUser(userId: number): Promise<void> {
    const queryString = `DELETE FROM diabetes.USERINFO WHERE User_Id = ${userId}`;
    try {
        await pool.query(queryString);
    } catch (error) {
        console.error(`Error deleting user ${userId}: query execution failure`, error);
    }
}
