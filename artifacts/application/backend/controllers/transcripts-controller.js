const _ = require('lodash');
const ReturnResult = require('../libs/ReturnResult');
const Constants = require('../libs/Constants');
const transcriptsService = require('../services/transcripts-service');

exports.addNewTranscriptForStudent = async (req, res) => {
    const body = _.get(req, 'body', {});
    try {
        const email = req.userData.email;
        const payload = {
            studentID: body.student.studentID,
            studentName: body.student.studentName,
            uniCode: body.student.uniCode,
            class: body.student.class,
            transcript: body.student.transcript
        };

        const result = await transcriptsService.addTranscript(email, payload);

        if(result.success)
            return res.send(new ReturnResult(result.data, Constants.messages.CREATE_NEW_TRANSCRIPT_SUCCESS, null, 0));
        return res.send(new ReturnResult(null, null, `FABRIC API: ${result.message}`, 1));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message));
    }
}

exports.updateStudentTranscript = async (req, res) => {

}

exports.showDetailTranscript = async (req, res) => {
    const body = _.get(req, 'body', {});
    try {
        const email = req.userData.email;
        const trxID = body.trxID;
        const result = await transcriptsService.getDetailTranscriptByTrxID(email, trxID);
        if(result.success)
            return res.send(new ReturnResult(result.data, Constants.messages.GET_TRANSCRIPT_SUCCESS, null, 0));
        return res.send(new ReturnResult(null, null, `FABRIC API: ${result.message}`, 1));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message));
    }
}

exports.historyTranscript = async (req, res) => {
    const body = _.get(req, 'body', {});
    try {
        const email = req.userData.email;
        const studentID = body.studentID;
        const result = await transcriptsService.getHistoryTransaction(email, studentID);
        if(result.success)
            return res.send(new ReturnResult(result.data, Constants.messages.GET_TRANSCRIPT_HISTORY_SUCCESS, null, 0));
        return res.send(new ReturnResult(null, null, `FABRIC API: ${result.message}`, 1));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message));
    }
}

exports.updateTranscript = async (req, res) => {
    const body = _.get(req, 'body', {});
    try {
        const email = req.userData.email;
        const student = {
            studentID: body.student.studentID,
            studentName: body.student.studentName,
            uniCode: body.student.uniCode,
            class: body.student.class,
            transcript: body.student.transcript
        };

        const result = await transcriptsService.updateTranscript(email, student);
        if(result.success)
            return res.send(new ReturnResult(result.data, Constants.messages.UPDATE_TRANSCRIPT_HISTORY_SUCCESS, null, 0));
        return res.send(new ReturnResult(null, null, `FABRIC API: ${result.message}`, 1));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message));
    }
}

exports.deleteTranscript = async (req, res) => {
    const body = _.get(req, 'body', {});
    try {
        const email = req.userData.email;
        const studentID  = body.studentID;
        const result = await transcriptsService.deleteTranscript(email, studentID);
        if(result.success)
            return res.send(new ReturnResult(result.data, Constants.messages.DELETE_TRANSCRIPT_SUCCESS, null, 0));
        return res.send(new ReturnResult(null, null, `FABRIC API: ${result.message}`, 1));
    } catch (err) {
        console.log(err)
        res.status(400).send(new ReturnResult(null, null, err.message));
    }
}






