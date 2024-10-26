export const columns = [
  { field: "id", headerName: "ID", width: 33 },
  { field: "related_bus", headerName: "Related Bus", width: 100 },
  { field: "entering_time", headerName: "Entering Time", width: 150 },
  { field: "leaving_time", headerName: "Leaving Time", width: 150 },
  { field: "image", headerName: "Image", width: 150, renderCell: (params) => (
      <img src={params.value} alt="Passenger" style={{ width: '100%', height: 'auto' }} />
    ),
  },
];

export const rows = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    age: 35,
    phone: "(665)121-5454",
    address: "0912 Won Street, Alabama, SY 10001",
    city: "New York",
    zipCode: "10001",
    registrarId: 123512,
    entering_time: "2024-09-27 15:31:09",
    image: "https://firebasestorage.googleapis.com/v0/b/buspassengermonitoring.appspot.com/o/Passenger_Images%2Fz1dRNSqn.jpg?alt=media",
    leaving_time: "2024-09-27 16:19:50",
    related_bus: "40",
    state: "outside the bus",
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    age: 42,
    phone: "(421)314-2288",
    address: "1234 Main Street, New York, NY 10001",
    city: "New York",
    zipCode: "13151",
    registrarId: 123512,
    entering_time: "2024-09-27 15:32:00",
    image: "https://firebasestorage.googleapis.com/v0/b/buspassengermonitoring.appspot.com/o/Passenger_Images%2Fexample.jpg?alt=media",
    leaving_time: "2024-09-27 16:20:00",
    related_bus: "40",
    state: "inside the bus",
  },
  // Add more rows as needed...
];