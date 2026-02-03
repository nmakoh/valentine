Rails.application.routes.draw do
  root "pages#show"

  post "/answer", to: "pages#answer"
  get  "/yes",    to: "pages#yes"
end
