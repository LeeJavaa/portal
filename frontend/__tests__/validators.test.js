import {expect, test, describe} from 'vitest'
import { analysisSchema } from '@/validators/newAnalysis'

describe('Analysis Schema', () => {
    const validAnalysis = {
        played_date: new Date(),
        input_file: 'game_replay.txt',
        title: 'Match Analysis',
        map: 'Rio',
        game_mode: 'Hardpoint',
        start_time: '5.45',
        team_one: 'Atlanta FaZe',
        team_two: 'OpTic Texas'
    }

    test('validates a correct analysis object', () => {
        const result = analysisSchema.safeParse(validAnalysis);
        expect(result.success).toBe(true);
    });

    test('played_date field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, played_date: 'not a date' }).success).toBe(false);
        expect(analysisSchema.safeParse({ ...validAnalysis, played_date: new Date('invalid') }).success).toBe(false);
    });

    test('input_file field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, input_file: '' }).success).toBe(false);
        expect(analysisSchema.safeParse({ ...validAnalysis, input_file: 'a'.repeat(256) }).success).toBe(false);
    });

    test('title field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, title: '' }).success).toBe(false);
        expect(analysisSchema.safeParse({ ...validAnalysis, title: 'a'.repeat(256) }).success).toBe(false);
    });

    test('map field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, map: '' }).success).toBe(false);
    });
    
    test('game_mode field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, game_mode: '' }).success).toBe(false);
        expect(analysisSchema.safeParse({ ...validAnalysis, game_mode: 'a'.repeat(256) }).success).toBe(false);
    });
    
    test('start_time field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, start_time: 'not a number' }).success).toBe(false);
        expect(analysisSchema.safeParse({ ...validAnalysis, start_time: '123.45.67' }).success).toBe(false);
        expect(analysisSchema.safeParse({ ...validAnalysis, start_time: '123' }).success).toBe(true);
        expect(analysisSchema.safeParse({ ...validAnalysis, start_time: '123.45' }).success).toBe(true);
    });
    
    test('team_one field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, team_one: '' }).success).toBe(false);
    });
    
    test('team_two field', () => {
        expect(analysisSchema.safeParse({ ...validAnalysis, team_two: '' }).success).toBe(false);
    });
})