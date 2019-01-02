import { Storage } from "aws-amplify";

class S3Storage {
    // User-Level Functions
    static putImages(folderPath, images, successHandler, failureHandler) {

    }
    // Content-Level Functions
    static putImage(path, image, successHandler, failureHandler) {
        S3Storage.put(path, image, "image/*", successHandler, failureHandler);
    }
    static putVideo(path, video, successHandler, failureHandler) {
        S3Storage.put(path, video, "video/*", successHandler, failureHandler);
    }
    static putVideoOrImage(path, media, successHandler, failureHandler) {
        S3Storage.put(path, media, "video/*;image/*", successHandler, failureHandler);
    }
    // Low Level Functions
    static get(path, successHandler, failureHandler) {
        // returns URL
        Storage.get(path).then((url) => {
            console.log("Storage successfully retrieved file! URL = " + url);
            successHandler(url);
        }).catch((error) => {
            console.error("Storage failed to retrieve file with path = " + path + "... Error: " + JSON.stringify(error));
            failureHandler(error);
        });
    }
    static put(path, file, contentType, successHandler, failureHandler) {
        Storage.put(path, file, { contentType }).then((result) => {
            console.log("Storage successfully put file in! Result: " + JSON.stringify(result));
            successHandler(result);
        }).catch((error) => {
            console.error("Storage failed put function... Error: " + JSON.stringify(error));
            failureHandler(error);
        });
    }
}

export default S3Storage;
