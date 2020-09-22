# Architecture

## Node.js 3 Layer Architecture

`Controller Layer <--> Service Layer <--> Data Access Layer`

### Controller Layer

- Page routing

### Service Layer

- Business Logic
- Performing functions, calling DAOs and reporting to controllers

### Data Access Layer

- Direct database interaction
- DAO Classes defined here

## Pages and Features

    |- Dashboard (index)
    |  |- Calendar
    |  |  |- Current Date
    |  |  |- Events Today and Details (formality, time, etc)
    |  |
    |  |- Weather
    |  |  |- Shows Temp/feels like, Precip, Wind
    |  |  |- Configurable Location by zip
    |  |
    |  |- Outfit
    |  |  |- Generate New
    |  |  |- Save as preset
    |  |  |- Lock a certain article and regen.
    |
    |- Closet
    |  |- View all articles
    |  |- Flag item as dirty
    |  |- View Single Article
    |  |  |- View tags, name, props, rating, etc.
    |  |  |- Edit tags, name, properties, rating, etc
    |  |
    |  |- Filter/sort by season, type, color, rating, etc.
    |  |- Insert new article
    |  |  |- Like view single article but entirely editable
    |
    |- Account/Settings
    |  |- Email, password, connect calendar, set weather zip, etc.

## Database Entities

### User

Fields
- UserID
- Name
- Email
- Password
- calendar credentials
- Saved Zip code

### Closet

Fields
- Owner(UserID)
- ClosetID
- Name

### Article

Fields
- ClosetID
- ArticleID
- Name
- Desc.
- Image
- Type (Top, bottom, Singlet, optional Singlet)
- Properties
  - Color
  - Season
  - Rating(ordinal)
  - Formal(binary)

### Metadata

Written for each interaction with articles while choosing

Fields
- ArticleID
- MetadataID
- Date
- Day of week
- Weather
  - Temp, precip, wind
- Accepted Article (bool)
