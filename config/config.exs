# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :radio_guerilla,
  ecto_repos: [RadioGuerilla.Repo]

# Configures the endpoint
config :radio_guerilla, RadioGuerilla.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "tkI+fxN+/Qwqh1OdS7K0JHMYUlGIDYGwpIe5fbsqQ98KGXIq1rrN/PuILHXaIUYB",
  render_errors: [view: RadioGuerilla.ErrorView, accepts: ~w(html json)],
  pubsub: [name: RadioGuerilla.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
