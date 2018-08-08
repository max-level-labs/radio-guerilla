defmodule RadioGuerilla.CallController do
  use RadioGuerilla.Web, :controller

  def index(conn, _params) do
    render conn,"index.html"
  end
end
