def process_scoreboard(file_name: str):
    """
    This function handles the task of performing OCR on a scoreboard screenshot and extracting the relevant data from
    it. This will also update a progress variable that will be used during SSE to display the progress update on the
    frontend.

    The data returned may look something as follows:
    {
        "game_mode": "Hardpoint",
        "map": "Karachi",
        "team_one": "OpTic Texas",
        "team_one_score": 250,
        "team_two": "New York Subliners",
        "team_two_score": 212,
        "player_stats" : {
            "Kenny" : {}
            "Dashy" : {},
            "Shotzzy" : {},
            "Pred" : {},
            "Hydra" : {},
            "Kismet" : {},
            "Skyz" : {},
            "Sib" : {}
        }
    }

    args:
        - file_name [Str]: The name of the scoreboard screenshot file as stored on S3.
    returns:
        - progress [Int (0 -> 100)]: The progress of the scoreboard processing. This is a value between 0 and 100.
        - data [Dict]: A dictionary response of the extracted data. Empty until processing is complete. Example above.
    raises:
        -
    """
    pass
