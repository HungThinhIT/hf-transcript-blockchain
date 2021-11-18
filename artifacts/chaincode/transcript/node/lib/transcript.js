/*
 * Copyright GitHub@HungThinh0710. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Transcript extends Contract {

    async initLedger(ctx) {
        console.log('============= START : Initialize Ledger ===========');
        const students = [
            {
                studentID: '17IT100',
                studentName: 'Nguyễn Hưng Thịnh',
                uniCode: 'VKU',
                class: '17IT2',
                transcripts: [{
                    semester: 1,
                    semesterText: 'Học kỳ 1 - 2017-2018',
                    year: 2017,
                    universityCode: "VKU",
                    subjects: [
                        {
                            sbjName: 'Lập trình hướng đối tượng và Java Cơ Bản',
                            sbjCode: 'JAVA_17_2',
                            credit: 3,
                            attendanceScore: 10.0,
                            exerciseScore: 9,
                            middleExamScore: 9,
                            FinalExamSCore: 10
                        },
                        {
                            sbjName: 'Đại số ',
                            sbjCode: 'DAISO_17_2',
                            credit: 3,
                            attendanceScore: 8.0,
                            exerciseScore: NaN,
                            middleExamScore: 5,
                            FinalExamSCore: 8
                        },
                    ]
                }],
            },
            {
                studentID: '17IT129',
                studentName: 'Trần Quốc Bảo',
                uniCode: 'VKU',
                class: '17IT2',
                transcripts: [{
                    semester: 1,
                    semesterText: 'Học kỳ 1 - 2017-2018',
                    year: 2017,
                    universityCode: "VKU",
                    subjects: [
                        {
                            sbjName: 'Lập trình hướng đối tượng và Java Cơ Bản',
                            sbjCode: 'JAVA_17_2',
                            credit: 3,
                            attendanceScore: 5.0,
                            exerciseScore: 2,
                            middleExamScore: 3.5,
                            FinalExamSCore: 1
                        },
                        {
                            sbjName: 'Đại số ',
                            sbjCode: 'DAISO_17_2',
                            credit: 3,
                            attendanceScore: 9.0,
                            exerciseScore: NaN,
                            middleExamScore: 1,
                            FinalExamSCore: 5
                        },
                    ]
                }],
            }
        ];
        for (let i = 0; i < students.length; i++) {
            students[i].docType = 'example_variable';
            await ctx.stub.putState( `${students[i].uniCode}_${students[i].studentID}`, Buffer.from(JSON.stringify(students[i])));
            console.log('Added <--> ', students[i]);
        }
        console.log('============= END : Initialize Ledger ===========');
        return "Initialize successfully";
    }

    async _isTranscriptExist(ctx, studentID){
        const transcriptAsBytes = await ctx.stub.getState(studentID);
        if (!transcriptAsBytes || transcriptAsBytes.length === 0) {
            return false;
        }
        return transcriptAsBytes.toString('utf-8');
    }

    async addNewTranscript(ctx, studentID, student){
        if(await this._isTranscriptExist(ctx, studentID) === false){
            return await ctx.stub.putState(studentID, Buffer.from(student));
        }
        throw new Error(`Transcript for ${studentID} already exists.`);
    }

    async updateTranscript(ctx, studentID, payload){
        if(await this._isTranscriptExist(ctx, studentID) !== false){
            return await ctx.stub.putState(studentID, Buffer.from(payload));
        }
        throw new Error(`Transcript with student ID: "${studentID}" is not exists.`);
    }

    // async deleteTranscript(ctx, studentID){
    //
    // }


    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async queryAllCars(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = Transcript;
