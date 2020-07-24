import * as core from '@actions/core'
import * as github from '@actions/github'
import snowplow from 'snowplow-tracker'

async function run(): Promise<void> {
  try {
    const emitter = snowplow.emitter(
      '07cccea4143a.ngrok.io', // Collector endpoint
      'http', // Optionally specify a method - http is the default
      80, // Optionally specify a port
      'POST', // Method - defaults to GET
      1, // Only send events once n are buffered. Defaults to 1 for GET requests and 10 for POST requests.
      function (e: string) {
        // Callback called for each request
        if (e) {
          throw e
        }
      },
      {maxSockets: 6} // Node.js agentOptions object to tune performance
    )
    const tracker = snowplow.tracker([emitter], 'myTracker', 'myApp-pre', false)
    tracker.trackUnstructEvent({
      schema: 'iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0',
      data: github.context
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
