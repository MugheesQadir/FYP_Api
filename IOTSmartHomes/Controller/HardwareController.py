relay_state = {"state": 0}

class HardwareController:
    @staticmethod
    def set_relay_state(data):
        try:
            if data["state"] in [0, 1]:  # Validate state (0 or 1)
                relay_state["state"] = data["state"]
                return {"message": "Relay state updated", "current_state": relay_state["state"]}
            return {"error": "Invalid state. Must be 0 or 1."}
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}

    @staticmethod
    def get_relay_state():
        return {"state": relay_state["state"]}