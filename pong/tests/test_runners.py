# ================================
# akolgano
# ================================

# My custom unit test runner

from django.test.runner import DiscoverRunner
import unittest

class CustomTextTestResult(unittest.TextTestResult):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.test_outcomes = {}

    def addSuccess(self, test):
        super().addSuccess(test)
        self.test_outcomes[test] = 'OK'

    def addFailure(self, test, err):
        super().addFailure(test, err)
        self.test_outcomes[test] = 'FAILED'

    def addError(self, test, err):
        super().addError(test, err)
        self.test_outcomes[test] = 'ERROR'

class CustomTestRunner(DiscoverRunner):
    def run_suite(self, suite, **kwargs):
        result = CustomTextTestResult(stream=None, descriptions=True, verbosity=2)
        runner = unittest.TextTestRunner(stream=None, descriptions=True, verbosity=2)
        runner.run(suite)

        # Print results
        for test, outcome in result.test_outcomes.items():
            print(f'{test} .... {outcome}')

        return result