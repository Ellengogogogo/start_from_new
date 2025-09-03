import os
from langchain_openai import AzureChatOpenAI
from component.llm import LLMBase
from component.llm.prompts import BESCHREIBUNG_PROMPT_DE, LOCATION_PROMPT_DE
from app.schemas.property import PropertyCreate


AZURE_OPENAI_DEPLOYMENT = "gpt-4"
AZURE_OPENAI_ENDPOINT = "https://playground-gen-openai.openai.azure.com"
AZURE_OPENAI_API_KEY = os.environ.get("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_API_VERSION = "2024-08-01-preview"

class AzureOpenAILLM(LLMBase):
    def __init__(self):
        self._llm = AzureChatOpenAI(
            azure_deployment="gpt4o",
            openai_api_version="2024-08-01-preview",
            openai_api_key=AZURE_OPENAI_API_KEY,
            azure_endpoint="https://playground-gen-openai.openai.azure.com/",
            openai_api_type="azure"
        )

    def query_llm_description(self, property_data: PropertyCreate, style: str):
        # Format the prompt with the user input
        property_type = property_data.property_type
        area_sqm = property_data.area_sqm
        rooms = property_data.rooms
        year_built = property_data.year_built
        address = property_data.address
        city = property_data.city
        description = property_data.description

        prompt = BESCHREIBUNG_PROMPT_DE.format(property_type, rooms, area_sqm, year_built, address, city, description)
        
        # Call the LLM with the formatted prompt
        response = self._llm.invoke([{"role": "user", "content": prompt}])
        
        # Return the generated description
        return response.content.strip()
    
    def query_llm_location(self, property_data: PropertyCreate):
        # Format the prompt with the user input
        city = property_data.city
        address = property_data.address
        location_keywords = property_data.location_keywords

        prompt = LOCATION_PROMPT_DE.format(city, address, location_keywords)
        
        # Call the LLM with the formatted prompt
        response = self._llm.invoke([{"role": "user", "content": prompt}])
        
        # Return the generated description
        return response.content.strip()
