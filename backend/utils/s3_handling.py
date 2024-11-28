"""
In this file we will do all the handling with respect to fetching and uploading items to the S3 bucket.
"""
import numpy as np
from typing import Dict, Any

import boto3
from django.conf import settings
from botocore.exceptions import ClientError, ConnectionError

def init_s3_client():
    """
    Initialize the S3 client with error handling.

    Returns:
        boto3.client: Initialized S3 client

    Raises:
        Exception: If unable to establish connection with S3
    """
    try:
        return boto3.client('s3')
    except Exception as e:
        raise Exception(f"Failed to initialize S3 client: {str(e)}")

s3_client = init_s3_client()

def generate_upload_scoreboard_url(file_name: str) -> Dict[str, any]:
    """
    Generates a temporary url that can be used by external clients to upload images to the S3 bucket.

    args:
        - file_name [Str]: The name of the image file that the client wants to upload.
    returns:
        - presigned_post [GeneratePresignedPost Object]: The generate presigned post object contains the temporary url
        that can be used as well as the necessary fields that need to be passed in when accessing the url.
    raises:
        - Exception
    """
    try:
        presigned_post = s3_client.generate_presigned_post(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=file_name,
            ExpiresIn=3600
        )
        return presigned_post
    except (ConnectionError, ClientError, Exception) as e:
        raise Exception(f"Failed to generate upload URL: {str(e)}")

def generate_view_scoreboard_url(file_name: str) -> str:
    """
    Generates a temporary url that can be used by external client to view images on the S3 bucket.

    args:
        - file_name [Str]: The name of the image file that the client wants to view.
    returns:
        - url [Str]: The url that can be accessed to view the file
    raises:
        - ClientError: If we are unable to establish connection with S3
        - Exception: If the file does not exist in the s3 bucket or a general error occurs
    """
    try:
        try:
            s3_client.head_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name)
        except ClientError as e:
            if e.response['Error']['Code'] == "404":
                raise Exception(f"File {file_name} not found in bucket.")
            raise

        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': file_name
            },
            ExpiresIn=3600
        )
        return url
    except (ConnectionError, ClientError, Exception) as e:
        raise Exception(f"Failed to generate view scoreboard URL: {str(e)}")

def get_object_from_bucket(file_name: str) -> bytes:
    """
    Fetches the content from the S3 bucket.

    args:
        - file_name [Str]: The name of the file to fetch.
    returns:
        - s3_content [Str]: The binary data of the file.
    raises:
        - ClientError: If we can't connect to client
        - Exception: if the file does not exist or there was a general error fetching it
    """
    try:
        s3_object = s3_client.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name)
        s3_content = s3_object['Body'].read()

        return s3_content
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            raise Exception(f"File {file_name} not found in bucket")
        raise
    except Exception as e:
        raise Exception(f"Error fetching object: {str(e)}")

def binary_to_np_array(content: bytes) -> np.ndarray:
    """
    Converts binary data to a numpy array.

    args:
        - content [Str]: The binary data to convert.
    returns:
        - np_array [NumPy Array]: The converted binary data.
    """
    try:
        return np.frombuffer(content, dtype=np.uint8)
    except Exception as e:
        raise Exception(f"Error converting binary data: {str(e)}")
