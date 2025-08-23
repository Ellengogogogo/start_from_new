from abc import ABC, abstractmethod


class LLMBase(ABC):

    @abstractmethod
    def query_llm_question(self):
        pass
