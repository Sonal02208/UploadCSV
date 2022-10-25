sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("demo.uploadcsv.uploadcsv.controller.View1", {
            onInit: function () {

            },
            handleUploadComplete: function (oEvent) {
                var sResponse = oEvent.getParameter("response"),
                    iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
                    sMessage;

                if (sResponse) {
                    sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                    MessageToast.show(sMessage);
                }
            },
            handleUploadPress: function () {
                var oFileUploader = this.byId("FileUploaderId");
                if (!oFileUploader.getValue()) {
                    MessageToast.show("Choose a file first");
                    return;
                }
                oFileUploader.checkFileReadable().then(function () {
                    oFileUploader.upload();
                }, function (error) {
                    MessageToast.show("The file cannot be read. It may have changed.");
                }).then(function () {
                    oFileUploader.clear();
                    MessageToast.show("The file uploaded successfully.");
                });
            },

            handleTypeMissmatch: function (oEvent) {
                var aFileTypes = oEvent.getSource().getFileType();
                aFileTypes.map(function (sType) {
                    return "*." + sType;
                });
                MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                    " is not supported. Choose the following type: " +
                    aFileTypes.join(", "));
            },

            handleValueChange: function (oEvent) {
                MessageToast.show("Press 'Upload File' to upload file '" +
                    oEvent.getParameter("newValue") + "'");
            }

        });
    })
