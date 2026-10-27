# LearnRT

A mobile app that teaches first-time riders, and keeps daily commuters informed, about the Philippine urban rail network.

## Network

**Line**:
A named rail service with its own stations and direction of travel, such as LRT-1, LRT-2 or MRT-3.
_Avoid_: Railway, route, train line

**Station**:
A stop on a Line where riders board or alight.
_Avoid_: Stop, terminal (unless it is a Line's end)

**Transfer**:
A walk between two Stations that lets a rider change from one Line to another, such as Doroteo Jose to Recto.
_Avoid_: Interchange, connection

**Line Status**:
Whether a Line is operational, coming soon, or suspended.
_Avoid_: Availability, open/closed

## Riding

**Guided Ride**:
An active, step-by-step trip a rider follows from an origin Station to a destination Station, including any Transfers.
_Avoid_: Trip, journey, navigation

**Saved Commute**:
A Guided Ride a rider has stored to repeat and be alerted about.
_Avoid_: Favorite route, bookmark

## Live information

**Rider Report**:
A short-lived observation a signed-in rider submits about a Station or Line, such as crowding, a delay or a broken facility.
_Avoid_: Post, tip, comment

**Advisory**:
An official operator notice that an admin has curated into the app.
_Avoid_: Announcement, alert, news

**Headway Estimate**:
An approximate wait for the next train, derived from the published schedule rather than from tracking trains.
_Avoid_: Arrival time, ETA

**Segment Timing**:
An anonymous, opt-in measurement of how long a rider took between two adjacent Stations.
_Avoid_: Ride log, trip record

**Delay Signal**:
An automatic "slower than usual" flag raised when recent Segment Timings are well above the usual baseline for that segment and time of day.
_Avoid_: Delay report (that is a Rider Report)
