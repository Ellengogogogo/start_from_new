import os

from component.llm.azure_openai import AzureOpenAILLM

# LLM_CLIENT = os.environ.get("LLM_CLIENT")
# print("[INFO]LLM_CLIENT:",LLM_CLIENT)
LLM_CLIENT = "Azure"

class LLMFactory:
    @staticmethod
    def create_llm_client():
        if LLM_CLIENT == "Azure":
            return AzureOpenAILLM()
        else:
            raise ValueError("Unknown LLM client")
