def parse_applicable_classes(applicable_classes_str: str):
    """Helper function to parse applicable classes from a comma-separated string"""
    return [x.strip() for x in applicable_classes_str.split(",")]