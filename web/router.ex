defmodule RadioGuerilla.Router do
  use RadioGuerilla.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", RadioGuerilla do
    pipe_through :browser # Use the default browser stack

    get "/", CallController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", RadioGuerilla do
  #   pipe_through :api
  # end
end
