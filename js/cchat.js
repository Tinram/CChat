
window.addEventListener("load", function() {Chatbox.loader();}, false);

window.addEventListener("unload", function() {Chatbox = null;}, false);


var Chatbox =
{
    /**
        * Crypto Chatbox.
        *
        * @author        Martin Latter
        * @copyright     Martin Latter, 2010 (original), 2013 (encrypted)
        * @version       2.05
        * @license       GNU GPL version 3.0 (GPL v3); http://www.gnu.org/licenses/gpl.html
        * @link          https://github.com/Tinram/CChat.git
    */

    /* CONFIGURATION */

    iCheckFreq:         6000,        // 6-second checks
    sFilePath:          "includes/",
    sCheckFile:         "check.php",
    sUpdateFile:        "update.php",
    sErrorBackground:   "#ffcc66",
    sDefaultBackground: "background:linear-gradient(to bottom, #fff, #f0f8ff 100%);",
    bDebug: false,

    /* END CONFIGURATION */


    sBR: "<br>",
    reLB: /\~/g, // line break symbol used
    iDbGID: 0,
    bSubmit: true, // multiple submission block


    /**
        * Setup event handlers.
    */

    loader: function()
    {
        document.getElementById("message").onclick = function()
        {
            Chatbox.charCounter();
        };

        document.getElementById("chatsubmit").onclick = function()
        {
            if (Chatbox.checkBlankSubmission()) // if fn returns true, proceed with submission
            {
                if (Chatbox.bSubmit)
                {
                    Chatbox.bSubmit = false;
                    Chatbox.checkUpdates(Chatbox.createUpdateObj(), "chatbox");
                }
            }
        };

        document.getElementById("message").onkeydown = Chatbox.charCounter;
        document.getElementById("message").onkeyup = Chatbox.charCounter;
        document.getElementById("decrypt").onclick = Chatbox.checkPass;
        Chatbox.scrollDown();
        Chatbox.charCounter();  // harmonise message box on page refresh if chars already added
        Chatbox.checkUpdates(); // initial AJAX check with id=0
        window.setInterval(Chatbox.checkUpdates, Chatbox.iCheckFreq); // incremental checks
    },


    /**
        * Chatbox field scroll handler.
    */

    scrollDown: function()
    {
        var oCB = document.getElementById("chatbox");
        oCB.scrollTop = oCB.scrollHeight; // fix for lost position
    },


    /**
        * Check user input.
        *
        * @return   boolean
    */

    checkBlankSubmission: function()
    {
        var
            oName = document.getElementById("name"),
            oPassword = document.getElementById("pw"),
            oMessage = document.getElementById("message"),
            oError = document.getElementById("error");

        oName.style.cssText = this.sDefaultBackground;
        oPassword.style.cssText = this.sDefaultBackground;
        oMessage.style.cssText = this.sDefaultBackground;

        if (oName.value === "" || oName.value === "name")
        {
            oError.innerHTML = "Please enter your name.";
            oName.style.background = this.sErrorBackground;
            oName.select();
            oName.focus();
            return false;
        }
        else if (oPassword.value === "")
        {
            oError.innerHTML = "Please enter your password.";
            oPassword.style.background = this.sErrorBackground;
            oPassword.select();
            oPassword.focus();
            return false;
        }
        else if (oMessage.value === "" || oMessage.value === "message")
        {
            document.getElementById("error").innerHTML = "Please enter a message.";
            oMessage.style.background = this.sErrorBackground;
            oMessage.select();
            oMessage.focus();
            return false;
        }
        else
        {
            oError.innerHTML = "";
            return true;
        }
    },


    /**
        * Report and constrain character limit in message field.
    */

    charCounter: function()
    {
        var
            iMaxLimit = 255,
            oField = document.getElementById("message"),
            oCounter = document.getElementById("remchar");

        if (oField.value.length > iMaxLimit)
        {
            oField.value = oField.value.substring(0, iMaxLimit);
        }
        else
        {
            oCounter.innerHTML = iMaxLimit - oField.value.length;
        }
    },


    /**
        * Filter certain characters, hash password, and encrypt message.
        *
        * @return   object
    */

    createUpdateObj: function()
    {
        var
            sFileName = Chatbox.sFilePath + Chatbox.sUpdateFile,
            sName = document.getElementById("name").value,
            sPassword = document.getElementById("pw").value,
            sMessage = document.getElementById("message").value;

        sMessage = sMessage.replace(/£/g, "GBP-");
        sMessage = sMessage.replace(/\r\n/g, "~");
        sMessage = sMessage.replace(/\n/g, "~");
        sMessage = Bf.e(SHA256(sPassword), sMessage);
        sMessage = encodeURIComponent(sMessage); // do not remove = base64 character corruption

        return {file: sFileName, name: sName, message: sMessage};
    },


    /**
        * Check password field.
    */

    checkPass: function()
    {
        var
            oPassword = document.getElementById("pw"),
            oError = document.getElementById("error"),
            oCont = {},
            oMessages = {},
            i = -1,
            n = 0,
            sTemp = "";

        if (oPassword .value === "")
        {
            oError.innerHTML = "Please enter your password.";
            oPassword.style.background = Chatbox.sErrorBackground;
            oPassword.select();
            oPassword.focus();
            return;
        }
        else
        {
            oPassword.style.background = "0"; // resets of any above errors
            oError.innerHTML = "";
            oError.style.background = "#fff";
            oCont = document.getElementById("chatbox");
            oMessages = oCont.getElementsByClassName("m");
            n = oMessages.length;

            for (; ++i < n;)
            {
                sTemp = Bf.d(SHA256(oPassword.value), oMessages[i].innerHTML);
                sTemp = sTemp.replace(Chatbox.reLB, Chatbox.sBR);
                oMessages[i].innerHTML = sTemp;
            }
        }
    },


    /**
        * Check for new messages on the server using POST AJAX.
        *
        * @param    object oPostData
        * @param    string sDiv
    */

    checkUpdates: function(oPostData, sDiv)
    {
        var
            sParams = "",
            sFileName = "",
            sUrl = "",
            sCb = "",
            sDMessage = "",
            sBRprefix = ": <br>",
            iRemGlobalID = 0,
            iResponseLen = 0,
            i = -1,
            oXmlHttp = {},
            oResponse = {},
            oCb = {},
            oMessage = {};

        if (sDiv === undefined)
        {
            sFileName = Chatbox.sFilePath + Chatbox.sCheckFile;
            iRemGlobalID = Chatbox.iDbGID;
            sUrl = sFileName;
            sParams = "id=" + Chatbox.iDbGID;
        }
        else
        {
            sFileName = oPostData.file;
            sParams = "id=" + Chatbox.iDbGID + "&n=" + oPostData.name + "&m=" + oPostData.message;
        }

        oXmlHttp = createXHR();
        oXmlHttp.open("POST", sFileName, true);
        oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        oXmlHttp.onreadystatechange = function()
        {
            if (oXmlHttp.readyState === 4 || oXmlHttp.readyState === "complete")
            {
                if (oXmlHttp.status === 200 || oXmlHttp.status === 304)
                {
                    oResponse = JSON.parse(oXmlHttp.responseText);

                    if (sDiv === undefined)
                    {
                        iResponseLen = oResponse.length;
                        oCb = document.getElementById("chatbox");
                        Chatbox.iDbGID = parseInt(oResponse[iResponseLen - 1].id, 10);

                        if (Chatbox.iDbGID > iRemGlobalID)
                        {
                            for (; ++i < iResponseLen;) // -1 will not work here for multiple submissions
                            {
                                if (document.getElementById("pw").value === "")
                                {
                                    oCb.innerHTML += oResponse[i].n + ": " + oResponse[i].m + Chatbox.sBR;
                                    Chatbox.scrollDown();
                                }
                                else
                                {
                                    sDMessage = Bf.d(SHA256(document.getElementById("pw").value), oResponse[i].m);
                                    sDMessage = sDMessage.replace(Chatbox.reLB, Chatbox.sBR);
                                    oCb.innerHTML += oResponse[i].n + ": " + sDMessage + Chatbox.sBR; // responsible for intermittent duplicate message bug
                                    Chatbox.scrollDown();
                                }

                                sCb = oCb.innerHTML;

                                if (sCb.lastIndexOf(sBRprefix) > - 1)
                                {
                                    sCb = sCb.slice(0, sCb.length - 6); // remove colon when no results returned
                                    oCb.innerHTML = sCb;
                                }
                            }

                            Chatbox.scrollDown();
                        }
                    }
                    else
                    {
                        oMessage = document.getElementById("message");
                        sDMessage = Bf.d(SHA256(document.getElementById("pw").value), oResponse.m);
                        sDMessage = sDMessage.replace(Chatbox.reLB, Chatbox.sBR);
                        document.getElementById(sDiv).innerHTML += oResponse.n + ": " + sDMessage + Chatbox.sBR;
                        oMessage.value = "";
                        oMessage.focus();
                        Chatbox.iDbGID = parseInt(oResponse.id, 10);
                        Chatbox.scrollDown();
                        Chatbox.charCounter();
                    }
                }
                else
                {
                    if (Chatbox.bDebug)
                    {
                        alert("An error occurred: " + oXmlHttp.statusText);
                    }
                }
            }

            Chatbox.bSubmit = true;
        };

        oXmlHttp.send(sParams);


        function createXHR()
        {
            if (XMLHttpRequest !== undefined)
            {
                return new XMLHttpRequest();
            }
            else if (window.ActiveXObject)
            {
                try
                {
                    var oXMLHttp = new ActiveXObject("MSXML2.XMLHttp");
                    return oXMLHttp;
                }
                catch (xhrError)
                {
                    alert("AJAX functionality is not supported (or trusted ActiveX has been disabled) in this version of IE.");
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

    }
};


/* SHA-256 hash implementation by Angel Marin and Paul Johnston */
function SHA256(s){
var chrsz=8,hexcase=0;function sa(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF),msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}function S(X,n){return(X>>>n)|(X<<(32-n));}function R(X,n){return(X>>>n);}function Ch(x,y,z){return((x&y)^((~x)&z));}function Maj(x,y,z){return((x&y)^(x&z)^(y&z));}function S0256(x){return(S(x,2)^S(x,13)^S(x,22));}function S1256(x){return(S(x,6)^S(x,11)^S(x,25));}function G0256(x){return(S(x,7)^S(x,18)^R(x,3));}function G1256(x){return(S(x,17)^S(x,19)^R(x,10));}function cs256(m,l){var a,b,c,d,e,f,g,h,i,j,ml,T1,T2,K=[0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2],HASH=[0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19],W=new Array(64);m[l>>5]|=0x80<<(24-l%32);m[((l+64>>9)<<4)+15]=l;for(i=0,ml=m.length;i<ml;i+=16){a=HASH[0];b=HASH[1];c=HASH[2];d=HASH[3];e=HASH[4];f=HASH[5];g=HASH[6];h=HASH[7];for(j=-1;++j<64;){if(j<16){W[j]=m[j+i];}else{W[j]=sa(sa(sa(G1256(W[j-2]),W[j-7]),G0256(W[j-15])),W[j-16]);}T1=sa(sa(sa(sa(h,S1256(e)),Ch(e,f,g)),K[j]),W[j]);T2=sa(S0256(a),Maj(a,b,c));h=g;g=f;f=e;e=sa(d,T1);d=c;c=b;b=a;a=sa(T1,T2);}HASH[0]=sa(a,HASH[0]);HASH[1]=sa(b,HASH[1]);HASH[2]=sa(c,HASH[2]);HASH[3]=sa(d,HASH[3]);HASH[4]=sa(e,HASH[4]);HASH[5]=sa(f,HASH[5]);HASH[6]=sa(g,HASH[6]);HASH[7]=sa(h,HASH[7]);}return HASH;}function str2binb(str){var bin=[],i=0,l=0,mask=(1<<chrsz)-1;for(l=str.length;i<l*chrsz;i+=chrsz){bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(24-i%32);}return bin;}function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="",c="",n=-1,l=string.length;for(;++n<l;){c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}return utftext;}function binb2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="",i=-1,l=0;for(l=binarray.length*4;++i<l;){str+=hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8+4))&0xF)+hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8))&0xF);}return str;}s=Utf8Encode(s);return binb2hex(cs256(str2binb(s),s.length*chrsz));}
