/* eslint-disable consistent-return */
const crypto = require('crypto');
const { Buffer } = require('buffer');

/*
*
*/
exports.generateRandomString = (len) => {
    let text = '';
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i += 1) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
};

//----------------------------------
const ENCRYPTION_KEY = 'y71blGi9ievncdcsCyA9Ix4zSKZbkAj3';
const IV_LENGTH = 16;

exports.encryptString = (text) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (err) {
        console.log(err);
    }
};
exports.decryptString = (text) => {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        console.log(err);
    }
};
