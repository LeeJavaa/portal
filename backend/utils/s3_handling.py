"""
In this file we will do all the handling with respect to fetching and uploading items to the S3 bucket.
"""
import boto3

from django.conf import settings

s3_client = boto3.client('s3')

def generate_upload_scoreboard_url(file_name: str):
    """
    Generates a temporary url that can be used by external clients to upload images to the S3 bucket.

    args:
        - file_name [Str]: The name of the image file that the client wants to upload.
    returns:
        - presigned_post [GeneratePresignedPost Object]: The generate presigned post object contains the temporary url
        that can be used as well as the necessary fields that need to be passed in when accessing the url.
    raises:
        -
    """
    presigned_post = s3_client.generate_presigned_post(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=file_name,
        ExpiresIn=3600
    )
    return presigned_post

def generate_view_scoreboard_url(file_name: str):
    """
    Generates a temporary url that can be used by external client to view images on the S3 bucket.

    args:
        - file_name [Str]: The name of the image file that the client wants to view.
    returns:
        - url [Str]: The url that can be accessed to view the file
    raises:
        -
    """
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': file_name
        },
        ExpiresIn=3600
    )
    return url

def get_object_from_bucket(file_name: str):
    """
    Fetches the content from the S3 bucket.

    args:
        - file_name [Str]: The name of the file to fetch.
    returns:
        - s3_content [Str]: The binary data of the file.
    raises:
        -
    """
    s3_object = s3_client.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name)
    s3_content = s3_object['Body'].read()

    return s3_content