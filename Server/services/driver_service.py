from models import Rides, JoinRideRequests
from datetime import datetime

class DriverService:
    @staticmethod
    def post_future_ride(_driver_id, _departure_location, _pickup_radius, _destination, _drop_radius,
                         _departure_datetime, _available_seats, _notes):
        """
        Posts a future ride based on provided details.

        Parameters:
        - departure_location: str, the departure location for the ride
        - pickup_radius: float, the pickup radius from the departure location
        - destination: str, the destination of the ride
        - drop_radius: float, the drop radius from the destination
        - departure_datetime: datetime, the date and time of departure
        - available_seats: int, the number of available seats in the ride
        - notes: str (optional), additional notes or preferences for the ride

        Returns:
        - success: bool, indicates whether the ride posting was successful
        """
        try:
            # Ensure departure_datetime is in the future
            if _departure_datetime <= datetime.now():
                raise ValueError("Departure date must be in the future")

            # Ensure available_seats is greater than 0
            if _available_seats <= 0:
                raise ValueError("Available seats must be greater than 0")

            # Create a new Ride object with the provided details
            new_ride = Rides(driver_id=_driver_id,
                departure_location=_departure_location,
                pickup_radius=_pickup_radius,
                destination=_destination,
                drop_radius=_drop_radius,
                departure_datetime=_departure_datetime,
                available_seats=_available_seats,
                notes=_notes
            )

            # Save the new ride to the database
            new_ride.save()

            # Return success indicating the ride was posted successfully
            return True
        except ValueError as ve:
            # Handle validation errors
            print(f"Validation error: {str(ve)}")
            return False
        except Exception as e:
            # Handle other exceptions, log errors, etc.
            print(f"Error posting future ride: {str(e)}")
            return False

    @staticmethod
    def get_ride_posts_by_user_id(user_id):
        """
        Fetches ride posts associated with a specific user ID.

        Parameters:
        - user_id: int, the ID of the user whose ride posts to fetch

        Returns:
        - ride_posts: list, a list of dictionaries containing ride post data
        """
        try:
            ride_posts = Rides.query.filter_by(driver_id=user_id).all()
            return [ride.to_dict() for ride in ride_posts]
        except Exception as e:
            # Handle any exceptions and return an empty list in case of errors
            print(f"Error fetching ride posts: {str(e)}")
            return []

    @staticmethod
    def update_ride_details(ride_id, new_details):
        """
        Updates details for a specific ride post with restrictions.

        Parameters:
        - ride_id: int, the ID of the ride post to be updated
        - new_details: dict, a dictionary containing the updated details for the ride post

        Returns:
        - success: bool, indicates whether the ride details update was successful
        """
        try:
            # Retrieve the ride post by its ID
            ride = Rides.query.get_or_404(ride_id)

            # Check if the departure_datetime has passed
            if ride.departure_datetime <= datetime.now():
                raise ValueError("Cannot update ride details after the departure time has passed")

            # Check validity of parameters
            for key, value in new_details.items():
                if key == "departure_datetime" and value <= datetime.now():
                    raise ValueError("Departure datetime must be in the future")
                if key == "available_seats" and value < 0:
                    raise ValueError("Available seats must be a non-negative integer")

            # Update the ride details with the new information
            for key, value in new_details.items():
                setattr(ride, key, value)

            # Save the updated ride details to the database
            ride.save()

            # Return success indicating the ride details were updated successfully
            return True
        except ValueError as ve:
            # Handle validation errors
            print(f"Validation error: {str(ve)}")
            return False
        except Exception as e:
            # Handle other exceptions, log errors, etc.
            print(f"Error updating ride details: {str(e)}")
            return False

    @staticmethod
    def manage_ride_request(ride_id, request_id, status_update):
        """
        Manages passenger ride requests for a specific ride.

        Parameters:
        - ride_id: int, the ID of the ride for which the request is being managed
        - request_id: int, the ID of the ride request being managed
        - status_update: str, the status update ('accept' or 'reject')

        Returns:
        - success: bool, indicates whether the request management was successful
        """
        try:
            # Retrieve the ride
            ride = Rides.query.get_or_404(ride_id)

            # Retrieve the ride request
            ride_request = JoinRideRequests.query.get_or_404(request_id)

            # Handle the status update (accept/reject) for the ride request
            if status_update == 'accept':
                # Update the status of the ride request to accepted
                ride_request.status = 'accepted'

                # Update the number of confirmed passengers for the ride
                ride.confirmed_passengers += 1

                # Notify the passenger about the acceptance
                # TODO: notify_passenger(ride_request.passenger_id, 'accepted')

            elif status_update == 'reject':
                # Update the status of the ride request to rejected
                ride_request.status = 'rejected'

                # Notify the passenger about the rejection
                # TODO: notify_passenger(ride_request.passenger_id, 'rejected')

            # Save changes to the database
            ride.save()
            ride_request.save()

            return True

        except Exception as e:
            print(f"Error managing ride request: {str(e)}")
            return False

    @staticmethod
    def get_pending_join_requests_for_ride(ride_id):
        """
        Retrieves the list of pending join requests for the specified ride.

        Parameters:
        - ride_id: int, the ID of the ride for which to retrieve pending requests

        Returns:
        - list of JoinRideRequests: The list of pending join requests for the ride
        """
        try:
            pending_requests = JoinRideRequests.query.filter_by(ride_id=ride_id, status='pending').all()
            return pending_requests
        except Exception as e:
            print(f"Error retrieving pending requests: {str(e)}")
            return []