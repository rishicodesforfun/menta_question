/**
 * Test Data Loader — dynamically imports canonical JSON for any test ID
 */

// Static imports for all canonical test JSONs (Vite needs static analysis)
import phq4 from '../../tests_json/phq-4.json';
import phq9 from '../../tests_json/phq-9.json';
import gad7 from '../../tests_json/gad-7.json';
import who5 from '../../tests_json/who-5.json';
import isi from '../../tests_json/isi.json';
import bai from '../../tests_json/bai.json';
import bdiii from '../../tests_json/bdi-ii.json';
import pss10 from '../../tests_json/pss-10.json';
import pss4 from '../../tests_json/pss-4.json';
import rses from '../../tests_json/rses.json';
import erq from '../../tests_json/erq.json';
import academicStress from '../../tests_json/academic-stress.json';
import adhdScreener from '../../tests_json/adhd-screener.json';
import burnout from '../../tests_json/burnout.json';
import personalityBfi10 from '../../tests_json/personality-bfi10.json';
import sdq from '../../tests_json/sdq.json';
import suicideRisk from '../../tests_json/suicide-risk.json';
import moodMdq from '../../tests_json/mood-mdq.json';
import cognitive from '../../tests_json/cognitive.json';
import psqi from '../../tests_json/psqi.json';
import iesR from '../../tests_json/ies-r.json';

const testDataMap: Record<string, any> = {
    'phq-4': phq4,
    'phq-9': phq9,
    'gad-7': gad7,
    'who-5': who5,
    'isi': isi,
    'bai': bai,
    'bdi-ii': bdiii,
    'pss-10': pss10,
    'pss-4': pss4,
    'rses': rses,
    'erq': erq,
    'academic-stress': academicStress,
    'adhd-screener': adhdScreener,
    'burnout': burnout,
    'personality-bfi10': personalityBfi10,
    'sdq': sdq,
    'suicide-risk': suicideRisk,
    'mood-mdq': moodMdq,
    'cognitive': cognitive,
    'psqi': psqi,
    'ies-r': iesR,
};

export function getTestData(testId: string): any {
    const data = testDataMap[testId];
    if (!data) throw new Error(`No test data found for: ${testId}`);
    return data;
}

export default testDataMap;
