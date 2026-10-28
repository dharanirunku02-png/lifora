import unittest
from simulation import LiforaSimulationEngine, haversine_distance_km
from models import BookingRequest

class TestLiforaSimulation(unittest.TestCase):
    def setUp(self):
        self.engine = LiforaSimulationEngine()

    def test_initial_state(self):
        state = self.engine.get_state()
        self.assertGreater(state["total_bookings"], 0)
        self.assertGreater(state["available_drivers"], 0)
        self.assertEqual(len(state["hospitals"]), 5)
        self.assertEqual(len(state["villages"]), 6)
        self.assertTrue(state["is_running"])

    def test_haversine_distance(self):
        # Denduluru to Asram Hospital is ~3.5 km
        dist = haversine_distance_km(16.7580, 81.1640, 16.7450, 81.1480)
        self.assertTrue(2.0 <= dist <= 5.0, f"Distance {dist} km out of expected range")

    def test_fare_calculation(self):
        # 10 km Auto trip
        fare_auto = self.engine.calculate_fare(10.0, "AUTO", False, False)
        # Base: 40 + 10*10 = 140
        self.assertEqual(fare_auto["total"], 140.0)

        # 10 km Auto trip with Wheelchair assistance (₹30)
        fare_wheelchair = self.engine.calculate_fare(10.0, "AUTO", True, False)
        self.assertEqual(fare_wheelchair["total"], 170.0)

        # Round trip with return discount
        fare_round = self.engine.calculate_fare(10.0, "AUTO", False, True)
        self.assertGreater(fare_round["return_leg"], 0.0)
        self.assertEqual(fare_round["total"], 140.0 + round(140.0 * 0.85, 2))

    def test_booking_lifecycle_and_receipt(self):
        req = BookingRequest(
            customer_name="Ramesh Naidu",
            patient_name="Ramesh Naidu",
            phone="+91 98492 88123",
            pickup_location="Denduluru Village",
            pickup_lat=16.7580,
            pickup_lng=81.1640,
            destination_hospital_id="hosp-asram",
            destination_hospital_name="Asram Medical College & Hospital",
            destination_lat=16.7450,
            destination_lng=81.1480,
            preferred_time="09:00 AM",
            journey_type="one_way",
            vehicle_category="CAR",
            passenger_count=2,
            needs_wheelchair=False
        )
        booking = self.engine.create_booking(req)
        self.assertEqual(booking.status, "DRIVER_ASSIGNED")
        self.assertIsNotNone(booking.driver_id)
        
        # Advance status
        self.engine.advance_booking_status(booking.id, "ARRIVED_AT_PICKUP")
        self.assertEqual(booking.status, "ARRIVED_AT_PICKUP")

        self.engine.advance_booking_status(booking.id, "PATIENT_PICKED_UP")
        self.assertEqual(booking.status, "PATIENT_PICKED_UP")

        self.engine.advance_booking_status(booking.id, "REACHED_HOSPITAL")
        self.assertEqual(booking.status, "REACHED_HOSPITAL")

        completed = self.engine.complete_booking(booking.id)
        self.assertEqual(completed.status, "COMPLETED")
        self.assertEqual(completed.payment_status, "PAID_DEMO")
        self.assertIsNotNone(completed.receipt_id)

        # Receipt check
        rec = self.engine.receipts.get(completed.receipt_id)
        self.assertIsNotNone(rec)
        self.assertEqual(rec.booking_id, booking.id)

    def test_ambulance_request(self):
        amb = self.engine.create_ambulance_request(
            caller_name="Rao",
            phone="+91 98481 00000",
            emergency_type="CARDIAC",
            pickup_location="Chintalapudi",
            pickup_lat=17.0600,
            pickup_lng=80.9850,
            hospital_name="District Government General Hospital (GGH)"
        )
        self.assertEqual(amb.status, "TRIAGED")
        self.assertEqual(amb.triage_priority, "CRITICAL")

        updated = self.engine.advance_ambulance_status(amb.id, "AMBULANCE_EN_ROUTE")
        self.assertEqual(updated.status, "AMBULANCE_EN_ROUTE")

    def test_demo_step_execution(self):
        res1 = self.engine.execute_demo_step(1)
        self.assertEqual(res1["step"], 1)

        res2 = self.engine.execute_demo_step(2)
        self.assertEqual(res2["step"], 2)
        self.assertIn("booking_id", res2)

if __name__ == "__main__":
    unittest.main()
