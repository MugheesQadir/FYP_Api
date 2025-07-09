import math
from datetime import datetime, date

from Model.Compartment import Compartment
from Model.CompartmentAppliance import CompartmentAppliance
from Model.Home import Home
from config import db

class FYPTaskController:

    @staticmethod
    def get_compartments_with_active_appliances(home_id):
        try:
            result = (
            db.session.query(Home, Compartment)
            .join(CompartmentAppliance, Compartment.id == CompartmentAppliance.compartment_id)
            .join(Home,Compartment.home_id == Home.id)
            .filter(Compartment.home_id == home_id)
            .filter(CompartmentAppliance.status == 1)
            .filter(CompartmentAppliance.validate == 1)
            .distinct()
            .all()
        )

            if not result:
                return {'message': 'No compartments with active appliances'}

            return [{
            "compartment_id": comp.id,
            "compartment_name": comp.name,
            "home_id": comp.home_id,
                "home_name":home.name
        } for home, comp in result]

        except Exception as e:
            return {'error': str(e)}, 500

    # @staticmethod
    # def get_compartments_with_not_active_appliances(home_id):
    #     try:
    #         # Subquery: compartments having at least one validated ON appliance
    #         subquery = (
    #             db.session.query(CompartmentAppliance.compartment_id)
    #             .join(Compartment)
    #             .filter(Compartment.home_id == home_id)
    #             .filter(CompartmentAppliance.status == 1)
    #             .filter(CompartmentAppliance.validate == 1)
    #             .distinct()
    #         )
    #
    #         # Main query: compartments NOT IN above subquery
    #         result = (
    #             db.session.query(Home, Compartment)
    #             .join(Home, Home.id == Compartment.home_id)
    #             .filter(Compartment.home_id == home_id)
    #             .filter(Compartment.id.notin_(subquery))
    #             .filter(Compartment.validate == 1)
    #             .all()
    #         )
    #
    #         if not result:
    #             return {'message': 'All compartments have at least one ON appliance'}
    #
    #         return [{
    #             "compartment_id": comp.id,
    #             "compartment_name": comp.name,
    #             "home_id": comp.home_id,
    #             "home_name": home.name
    #         } for home, comp in result]
    #
    #     except Exception as e:
    #         return {'error': str(e)}, 500

