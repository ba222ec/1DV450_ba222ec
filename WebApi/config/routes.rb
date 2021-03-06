Rails.application.routes.draw do

  post '/authenticate' => 'sessions#authenticate'
  
  get '/stories/search' => 'stories#search'
  get '/stories/nearby' => 'stories#nearby'
  post '/stories/:story_id/tags' => 'stories#add_tags'
  
  resources :creators, only: [ :create, :destroy, :index, :show ] do
    resources :stories, only: [ :index ]
  end
  
  resources :stories, only: [ :create, :destroy, :update, :index, :show ] do
    resources :tags, only: [ :index ]
    resources :creators, only: [ :index ]
  end
  
  resources :tags, only: [ :create, :index, :show ] do
    resources :stories, only: [ :index ]
  end
  
end
