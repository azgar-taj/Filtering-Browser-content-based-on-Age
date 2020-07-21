﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

namespace FaceAPILib
{
    public class FaceAPI
    {
        private string SUBSCRIPTION_KEY = Environment.GetEnvironmentVariable("FACE_SUBSCRIPTION_KEY");
        private string ENDPOINT = Environment.GetEnvironmentVariable("FACE_ENDPOINT");

        AzureBlobStorage blobhelper = new AzureBlobStorage();
        private string IMAGE_BASE_URL;
        public IFaceClient faceAPIClient;
        private string imageName;

        public FaceAPI(string imageName)
        {
            this.imageName = imageName;
            IMAGE_BASE_URL = blobhelper.GetImageUrl(imageName);
            faceAPIClient = blobhelper.AuthenticateToStorageService(ENDPOINT, SUBSCRIPTION_KEY);
        }

        const string RECOGNITION_MODEL2 = RecognitionModel.Recognition02;
        const string ECOGNITION_MODEL1 = RecognitionModel.Recognition01;

        public int GetAge()
        {
            return DetectFaceExtract(faceAPIClient, IMAGE_BASE_URL, RECOGNITION_MODEL2)
                .GetAwaiter()
                .GetResult();
        }

        public async Task<int> DetectFaceExtract(IFaceClient client, string url, string recognitionModel)
        { 
            IList<DetectedFace> detectedFaces;
            detectedFaces = await client.Face.DetectWithUrlAsync($"{url}{imageName}",
                    returnFaceAttributes: new List<FaceAttributeType> { FaceAttributeType.Accessories, FaceAttributeType.Age },
                    recognitionModel: recognitionModel);
            Console.WriteLine($"{detectedFaces.Count} face(s) detected from image `{imageName}`.");
            return (int)detectedFaces[0].FaceAttributes.Age;
        }
    }
}