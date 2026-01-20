import unittest
from unittest.mock import MagicMock
import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from app.services.db_service import fetch_tech_info

class TestFetchTechInfo(unittest.TestCase):
    def test_fetch_tech_info_none(self):
        # Mock database session
        mock_db = MagicMock()
        
        # Mock execute result -> fetchone() returns None
        mock_result = MagicMock()
        mock_result.fetchone.return_value = None
        mock_db.execute.return_value = mock_result

        print("\nTesting fetch_tech_info with no result...")
        try:
            result = fetch_tech_info(mock_db, "non_existent_tech")
            print(f"Result: {result}")
        except AttributeError as e:
            print(f"Caught expected error: {e}")
            raise e

if __name__ == '__main__':
    unittest.main()
