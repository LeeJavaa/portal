def create_map_analysis(payload):
    """
    Creates a single map analysis object from the request payload.

    args:
        - payload [ninja.Schema]: A schema containing the request payload.
    returns:
        - id [int]: The id of the created map analysis object
    raises:
        -
    """
    pass

def create_series_analysis(map_ids):
    """
    Creates a single series analysis object from the map analyses that were provided.

    args:
        - map_ids [List]: A list of map analysis object ids that will make up the series analysis.
    returns:
        - id [int]: The id of the created series analysis object
    raises:
        -
    """
    pass

def create_custom_analysis_from_maps(map_ids):
    """
    Creates a single custom analysis object from the map analyses that were provided.

    args:
        - map_ids [List]: A list of map analysis object ids that will make up the custom analysis.
    returns:
        - id [int]: The id of the created custom analysis object
    raises:
        -
    """
    pass

def create_custom_analysis_from_series(series_ids):
    """
    Creates a single custom analysis object from the series analyses that were provided.

    args:
        - series_ids [List]: A list of series analysis object ids that will make up the custom analysis.
    returns:
        - id [int]: The id of the created custom analysis object
    raises:
        -
    """
    pass

def delete_map_analyses(map_analyses_ids):
    """
    Deletes a group of map analyses, according to the list of ids given.

    args:
        - map_analyses_ids [List]: list of map analyses ids
    returns:
        - success [bool]: whether the deletion was successful
        - count [int]: amount of map analysis objects deleted
    raises:
        -
    """
    pass

def delete_series_analyses(series_analyses_ids):
    """
    Deletes a group of series analyses, according to the list of ids given.

    args:
        - series_analyses_ids [List]: list of series analyses ids
    returns:
        - success [bool]: whether the deletion was successful
        - count [int]: amount of series analysis objects deleted
    raises:
        -
    """
    pass

def delete_custom_analyses(custom_analyses_ids):
    """
    Deletes a group of custom analyses, according to the list of ids given.

    args:
        - custom_analyses_ids [List]: list of custom analyses ids
    returns:
        - success [bool]: whether the deletion was successful
        - count [int]: amount of custom analysis objects deleted
    raises:
        -
    """
    pass

def delete_map_analysis(map_analysis_id):
    """
    Deletes a single map analysis, according to the id given.

    args:
        - map_analysis_id [int]: the id of the map analysis object to delete
    returns:
        - success [bool]: whether the deletion was successful
    raises:
        -
    """
    pass

def delete_series_analysis(series_analysis_id):
    """
    Deletes a single series analysis, according to the id given.

    args:
        - series_analysis_id [int]: the id of the series analysis object to delete
    returns:
        - success [bool]: whether the deletion was successful
    raises:
        -
    """
    pass

def delete_custom_analysis(custom_analysis_id):
    """
    Deletes a single custom analysis, according to the id given.

    args:
        - custom_analysis_id [int]: the id of the custom analysis object to delete
    returns:
        - success [bool]: whether the deletion was successful
    raises:
        -
    """
    pass