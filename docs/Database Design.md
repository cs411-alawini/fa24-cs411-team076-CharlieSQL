## DDL Commands:

CREATE TABLE USERINFO (

  User_Id int,
  
  Age int,
  
  Gender varchar(10),
  
  Country varchar(100),
  
  Diagnosis varchar(10),
  
  PRIMARY KEY (User_Id)
  
);


CREATE TABLE COUNTRYINFO (

  Country varchar(20),
  
  Co2 double,
  
  LifeExpect double,
  
  OutHealthSpend varchar(20),
  
  Physicians double
  
  PRIMARY KEY (Country)
  
);


CREATE TABLE BIOMETRICSINFO (

  User_Id int NOT NULL,
  
  BioEntryDate date,
  
  BloodGlucose int,
  
  HbA1c double,
  
  BMI double,
  
  PRIMARY KEY (User_Id, BioEntryDate);
  
  FOREIGN KEY User_Id REFERENCES USERINFO.User_Id ON DELETE CASCADE
  
);


CREATE TABLE LIFESTYLEINFO (

  User_Id int NOT NULL,
  
  LifeEntryDate date,
  
  Smoker int,
  
  CheckChol int,
  
  Fruits int,
  
  Veggies int,
  
  PRIMARY KEY (User_Id, LifeEntryDate),
  
  FOREIGN KEY User_Id REFERENCES USERINFO.User_Id ON DELETE CASCADE
  
);


CREATE TABLE CONDITIONSINFO (

  User_Id int NOT NULL,
  
  CondEntryDate date,
  
  Stroke int,
  
  HighChol int,
  
  HighBP int,
  
  HeartDisease int,
  
  Hypertension int,
  
  PRIMARY KEY (User_Id, CondEntryDate),
  
  FOREIGN KEY User_Id REFERENCES USERINFO.User_Id ON DELETE CASCADE
  
);


