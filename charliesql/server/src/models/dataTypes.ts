export interface UserInfo {
    User_Id: number;
    Age: number;
    Gender: string;
    Country: string;
    Diagnosis: string;
};

export interface CountryInfo {
    Country: string;
    Co2: number;
    LifeExpect: number;
    OutHealthSpend: number;
    Physicians: number;
};

export interface BiometricsInfo {
    User_Id: number;
    BioEntryDate: Date;
    BloodGlucose: number;
    HbA1c: number;
    BMI: number;
};

export interface ConditionsInfo {
     User_Id: number;
     CondEntryDate: Date;
     Stroke: boolean;
     HighChol: boolean;
     HighBP: boolean;
     HeartDisease: boolean;
     Hyperten: boolean;
};

export interface LifestyleInfo {
    User_ID: number;
    LifeEntryDate: Date;
    Smoker: boolean;
    CheckChol: boolean;
    Fruits: boolean;
    Veggies: boolean;  
};