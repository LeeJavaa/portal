def generate_map_analyses_response(filter_payload):
    """
    This takes in all the filter data and generates an appropriate response containing all the filtered map analyses
    objects.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the filter data (tournament, game mode, map, team
        one, team two, player)
    returns:
        - map_analyses [List[Dict]]: A list of map analysis objects in dictionary form, only containing necessary data
        for compressed form.
    raises:
        -
    """
    pass

def generate_series_analyses_response(filter_payload):
    """
    This takes in all the filter data and generates an appropriate response containing all the filtered series analyses
    objects.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the filter data (tournament, team one, team two,
        player)
    returns:
        - series_analyses [List[Dict]]: A list of series analysis objects in dictionary form, only containing necessary
        data for compressed form.
    raises:
        -
    """
    pass

def generate_custom_analyses_response():
    """
    This simply fetches all the custom analysis objects and returns it in descending order (ordered by creation). Only
    containing necessary data for compressed form.

    args:
        - None
    returns:
        - series_analyses [List[Dict]]: A list of series analysis objects in dictionary form
    raises:
        -
    """
    pass

def generate_map_analysis_response(filter_payload):
    """
    This returns the data for a single map analysis according to the filters applied in the payload.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the map analysis id and filter data (team, player)
    returns:
        - map_analysis [Dict]: A single map analysis object
    raises:
        -
    """
    pass

def generate_series_analysis_response(filter_payload):
    """
    This returns the data for a single series analysis according to the filters applied in the payload.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the series analysis id and filter data (team,
        player)
    returns:
        - series_analysis [Dict]: A single series analysis object
    raises:
        -
    """
    pass

def generate_custom_analysis_response(filter_payload):
    """
    This returns the data for a single custom analysis according to the filters applied in the payload.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the custom analysis id and filter data (team,
        player)
    returns:
        - custom_analysis [Dict]: A single custom analysis object
    raises:
        -
    """
    pass
