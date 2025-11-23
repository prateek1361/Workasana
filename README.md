# Workasana

**Workasana is a full-stack Task, Project, and Team Management application designed to help users track work, visualize progress, and manage productivity.
Built using React, Bootstrap, Node.js, Express, and MongoDB, it includes dashboards, reports, CRUD operations, authentication, and real-time updates.

---

## 🔗 Demo Link

[Live Demo](https://workasana-iota.vercel.app/)

---

## 🚀 Quick Start

```bash
git clone https://github.com/prateek1361/Workasana.git
cd Workasana
npm install
npm run dev 
``` 

---

## Tech Stack

Frontend:
- React JS
- React Router
- Bootstrap
- useContext (React)
- Chart.js
- Fetch API (no Axios)
- Toast notifications


Backend:
- Node.js
- Express
- MongoDB
- Mongoose

---

## Demo Video
Watch a walkthrough (7-8 minutes) of all the major features of this app:
[Google Drive](https://drive.google.com/file/d/1mjyNdjfld8DT-zcfYvwMETb_GJgznb0t/view)


---


## Features

**Authentication**
- Login / Logout
- Persistent user session

**Dashboard**
- Total tasks
- Tasks completed
- Pending tasks
- Hours remaining
- Visual progress indicators

**Task Management**
- Add new projects
- View project-wise tasks
- Delete projects
- Cascade delete: deleting a project deletes all tasks inside it

**Project Management**
- Add/Remove items
- Move items between cart and wishlist
- Quantity adjustment

**Team Management**
- Add teams
- Assign tasks to teams
- Delete teams

**Reports & Visualizations**
- Total work done last week (chart)
- Total remaining work days (chart)
- Tasks closed by team (chart)
- Fully responsive charts

**Settings Page**
- Logout
- Delete Projects
- Delete Tasks
- Delete Teams
- Toast notifications for feedback


---


## API Reference

**Auth**
- POST /signup
- POST /login
- GET  /me

**Projects**
- GET    /projects
- POST   /projects
- DELETE /projects/:id  (auto deletes tasks)

**Tasks**
- GET    /tasks
- POST   /tasks
- GET    /tasks/:id
- DELETE /tasks/:id

**Teams**
- GET    /teams
- POST   /teams
- GET    /teams/:id
- PUT    /teams/:id
- DELETE /teams/:id  (auto deletes tasks owned by team)







---

## Contact

For any queries or feature request, please reach out to prateek20091234@gmail.com
