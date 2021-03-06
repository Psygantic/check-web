require 'httparty'
require 'rspec/retry'

RSpec.configure do |config|
  config.verbose_retry = false
  config.default_retry_count = 3
  config.default_sleep_interval = 3

  config.around :each do |ex|
    ex.run_with_retry retry: 3
  end

  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
end
