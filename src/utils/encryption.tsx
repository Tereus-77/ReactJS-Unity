import { Result } from 'antd'

const crypto = require('crypto-js');
export const encryption = (string: string) => {
    /////////////////////////////////////////////////////////
        //////////////////////   Encrypt   //////////////////////
        /////////////////////////////////////////////////////////
        var EncryptionStrength = 10; // 0 - 10
        var splitBy = "A";

        var docs = string;
        var num = "1234567890abcdefghijklmnopqrstuvwxyz";
        var url = "";

        num = num.replace(splitBy, "");

        for (var k = 0; k < docs.length; k++) {
            var count = docs[k].toString();
            for (var i = 0; i < count.length; i++) {
                for (var j = 0; j < EncryptionStrength; j++) {
                    url += num[Math.floor(Math.random() * (num.length - 0) + 0)];
                }
                url += count[i];
            }
            if (docs.length != k + 1) {
                url += splitBy;
            }
        }
    return url;
}
