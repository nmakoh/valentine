module Valentine
  class ResponseService
    Result = Struct.new(:success?)

    def self.call(answer)
      new(answer).call
    end

    def initialize(answer)
      @answer = answer
    end

    def call
      Result.new(@answer == "yes")
    end
  end
end
