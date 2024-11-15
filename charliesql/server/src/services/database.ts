import { UserInfo, CountryInfo, ConditionsInfo, LifestyleInfo, BiometricsInfo } from '../models/dataTypes';
import pool from './connections';
import { RowDataPacket } from 'mysql2';

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

