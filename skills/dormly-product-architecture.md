# DORMLY — Product Architecture

## Overview

Dormly is a premium modern dormitory management platform focused on:

- student living experience
- operational management
- maintenance workflows
- communication
- AI-assisted automation
- modern residence operations

The product should feel closer to:
- modern hospitality systems
- luxury residence operations
- architectural digital products
- premium student living platforms

NOT:
- enterprise ERP
- startup admin template
- generic SaaS dashboard
- crypto UI

---

# Core Product Structure

Dormly contains 4 operational roles:

1. Student
2. Manager
3. Admin
4. System Automation

The platform combines:
- room management
- maintenance workflows
- complaints
- communication
- notifications
- AI automation
- reporting
- operational analytics

into one connected operational ecosystem.

---

# Application Architecture

The application is intentionally separated into 2 major experiences.

---

# 1. Student Experience

Folder:

```bash
app/(student)
```

Purpose:

The student experience should feel:
- welcoming
- calm
- easy to use
- emotionally safe
- modern
- clean
- mobile-friendly

The student side is focused on:
- residence life
- communication
- issue reporting
- notifications
- room information
- AI support

Avoid:
- overly technical dashboards
- crowded admin UI
- enterprise complexity

---

## Student Features

### Account
- first password setup
- login/logout
- profile management
- upload personal documents
- password change
- waiting approval state

### Room Information
- current room details
- contract information
- room history
- transfer requests
- request tracking

### Maintenance & Incidents
- create incident reports
- upload images/videos
- priority levels
- track repair progress
- report history
- export PDF reports

### Complaints & Feedback
- anonymous complaints
- public complaints
- complaint tracking
- satisfaction rating

### Internal Communication
- direct messaging
- group chat
- file/image sharing

### Notifications
- emergency alerts
- power/water notifications
- regulation updates
- ticket updates
- notification history

### AI Assistant
- ask dormitory regulations
- ask utility pricing
- ask opening hours
- quickly report incidents
- automatic ticket creation

---

# 2. Platform Experience

Folder:

```bash
app/(platform)
```

Purpose:

The platform side is for:
- Managers
- Admins

At the current phase:
- Manager and Admin experiences can share most interfaces
- permission systems will be implemented later
- architecture should already support scalable permission expansion

The platform should feel:
- operational
- premium
- structured
- breathable
- intelligent
- calm

NOT:
- crowded ERP systems
- dense analytics overload
- traditional admin templates

---

# Manager Features

## Student Management
- view all students
- advanced filtering
- student profiles
- document approval
- learning status tracking
- special cases management

## Room Management
- building management
- floor management
- room management
- occupancy tracking
- automatic room assignment
- manual room assignment
- room transfer approval
- room history

## Maintenance Management
- incident tracking
- ticket assignment
- repair deadlines
- maintenance progress
- repair history
- export reports

## Complaint Management
- complaint review
- anonymous complaints
- resolution workflow
- satisfaction tracking

## Notifications
- global announcements
- targeted notifications
- emergency broadcasts

## Communication
- messaging
- group chat
- media/file sharing

## Dashboard & Analytics
- occupancy analytics
- maintenance analytics
- complaint analytics
- operational reports

---

# Admin Features

Admins contain all manager capabilities plus:

## System Management
- create manager accounts
- approve managers
- lock/unlock accounts
- reset passwords

## Infrastructure Configuration
- room configuration
- pricing configuration
- capacity configuration

## System Monitoring
- global analytics
- manager activity tracking
- system logs
- unresolved issue tracking

## Automation Configuration
- AI FAQ configuration
- automatic room assignment rules
- notification templates
- deadline rules

---

# System Automation

The system automatically handles:

## Notifications
- incident alerts
- overdue ticket alerts
- account approval emails
- status change notifications
- contract renewal reminders

## Workflow Automation
- automatic room assignment
- room occupancy updates
- overdue escalation flows

## AI Automation
- FAQ answering
- automated ticket creation
- operational assistance

---

# Permission Direction

Current Phase:
- Manager and Admin interfaces can mostly share UI
- permissions are not fully separated yet

Future Direction:
- role-permission architecture
- granular permissions
- modular access control
- scalable enterprise-ready authorization

The codebase should be structured with future permissions in mind.

---

# Dashboard Design Direction

Dashboards should feel:
- editorial
- architectural
- breathable
- premium
- operationally clear

Use:
- layered panels
- restrained metrics
- asymmetrical layouts
- soft glass surfaces
- large whitespace
- cinematic motion

Avoid:
- generic admin templates
- equal card grids
- crypto aesthetics
- overly dense layouts

---

# Motion Direction

Motion should feel:
- cinematic
- spatial
- elegant
- connected
- immersive

Use:
- smooth scroll storytelling
- layered transitions
- pinned sections
- staggered reveals
- environmental transitions
- animated dashboards
- image masking
- floating visual systems

Avoid:
- gimmicky motion
- excessive bouncing
- chaotic animation spam

---

# Visual Language

Dormly should emotionally communicate:

"A premium modern student living experience."

rather than:

"A generic dormitory management dashboard."

The atmosphere should feel:
- calm
- warm
- modern
- architectural
- immersive
- operationally intelligent
