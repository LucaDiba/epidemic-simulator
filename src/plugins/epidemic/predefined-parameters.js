predefined_epidemics = {
    "sars-cov-2-no-lockdown": {
        "name": "Covid-19 without lockdown",
        "parameters": {
            "initial_population": {
                "value": 400
            },
            "initial_infected": {
                "value": 10
            },
            "people_speed": {
                "value": 3.0
            },
            "desease_duration": {
                "value": 14
            },
            "incubation_period": {
                "value": 5,
                "unit": "days",
                "source": "https://www.who.int/news-room/q-a-detail/q-a-coronaviruses"
            },
            "infection_rate": {
                "value": 0.2
            },
            "lethality": {
                "value": 0.02
            }
        }
    }
};