from typing import Tuple

def parse_kd(kd_string: str) -> Tuple[int, int]:
    """
    Parse a K/D string in format "29/19" into kills and deaths integers.

    Args:
        kd_string (str): String in format "kills/deaths"

    Returns:
        Tuple[int, int]: (kills, deaths)

    Raises:
        ValueError: If string format is invalid
    """
    try:
        kills, deaths = map(int, kd_string.split('/'))
        return kills, deaths
    except ValueError:
        raise ValueError(f"Invalid K/D format: {kd_string}. Expected format: 'kills/deaths'")


def parse_time_to_seconds(time_str: str) -> int:
    """
    Convert time string in format "1:23" to seconds.

    Args:
        time_str (str): Time in format "minutes:seconds"

    Returns:
        int: Total seconds

    Raises:
        ValueError: If time format is invalid
    """
    try:
        minutes, seconds = map(int, time_str.split(':'))
        return minutes * 60 + seconds
    except ValueError:
        raise ValueError(f"Invalid time format: {time_str}. Expected format: 'minutes:seconds'")