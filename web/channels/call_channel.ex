defmodule RadioGuerilla.CallChannel do
  use Phoenix.Channel

  # handles the special `"lobby"` subtopic
  def join("call", _auth_message, socket) do
    {:ok, socket}
  end

  # # handles any other subtopic as the room ID, for example `"room:12"`, `"room:34"`
  # def join("call:" <> room_id, auth_message, socket) do
  #   {:ok, socket}
  # end

  def handle_in("message", %{"body" => body}, socket) do
    broadcast! socket, "message", %{body: body}
    {:noreply, socket}
  end

end
