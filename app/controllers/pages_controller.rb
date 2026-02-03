class PagesController < ApplicationController
  def show
  end

  def answer
    result = Valentine::ResponseService.call(params[:answer])

    if result.success?
      redirect_to yes_path
    else
      redirect_to root_path
    end
  end

  def yes
  end
end
