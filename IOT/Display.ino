#define CLASSROOM_NO '1'

#include <Arduino.h>
#if defined(ESP32) || defined(PICO_RP2040)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif

//Display Lib
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

// Uncomment according to your hardware type
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW
//#define HARDWARE_TYPE MD_MAX72XX::GENERIC_HW

// Defining size, and output pins
#define MAX_DEVICES 16
#define CS_PIN 15

MD_Parola Display = MD_Parola(HARDWARE_TYPE, CS_PIN, MAX_DEVICES);
//end display lib

#include <string.h>
#include <NTPClient.h>//Time 
#include <WiFiUdp.h>

#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

#define WIFI_SSID "Suspicious_Stick"
#define WIFI_PASSWORD "123456789"
#define API_KEY "AIzaSyC7dCDkYeYcJSPkytYPKk6quUu0DcWN3dA"

#define DATABASE_URL "nodemcu-7302e-default-rtdb.firebaseio.com/" 
#define USER_EMAIL "acbd@gmail.com"
#define USER_PASSWORD "123456789"

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;

unsigned long count = 0;

//time setup
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);


void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  digitalWrite(LED_BUILTIN, LOW);
  unsigned long ms = millis();
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(200);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
    digitalWrite(LED_BUILTIN, LOW);

  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  config.api_key = API_KEY;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  config.database_url = DATABASE_URL;

  config.token_status_callback = tokenStatusCallback;

  timeClient.begin();//time begin

  Display.begin();
  Display.setIntensity(0);


#if defined(ESP8266)
  fbdo.setBSSLBufferSize(2048 , 2048);
#endif

  fbdo.setResponseSize(2048);

  Firebase.begin(&config, &auth);

  Firebase.reconnectWiFi(true);

  Firebase.setDoubleDigits(5);

  config.timeout.serverResponse = 10 * 1000;

}

int lectureNumber(){

  int hours=timeClient.getHours()+5;
  int mins=timeClient.getMinutes();

  if( mins>=30){
    hours+=1;
    mins-=30;
  }else{
    mins+=30;
  }
  Serial.printf("IST Time: %d:%d\n",hours,mins);

  switch(hours){
    case 9:
      if(mins<55){
        return 1; 
      }
      return 2;
      break;

    case 10:
      if(mins<50){
        return 2; 
      }
      return 3;
      break;
    
    case 11:
      if(mins<10){
        return 3;
      }
      return 4;
      break;
    
    case 12:
      if(mins<5){
        return 4;
      }
      return 5;
      break;

    case 13:
      return 6;
      break;        

    case 14:
      if(mins<55){
        return 7;
      }
      return 8;
      break;    

    case 15:
      if(mins<50){
        return 8;
      }
      return 9;
      break;    

    case 16:
      if(mins<45){
        return 9;
      }
      return 10;
      break;    

    case 17:
      if(mins<40){
        return 10;
      }
      return 11;
      break;    


    default:
      return 11;
  }
  return 11;
}

void loop()
{

  
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 6000 || sendDataPrevMillis == 0))
  {
    timeClient.update();

    Serial.println("====================");
    
	int intDay = timeClient.getDay()+48;

    Serial.print("Day:");
    Serial.println(intDay-48);
    int lecNo = lectureNumber();

    char lecture[8]={'/',CLASSROOM_NO,'/',intDay,'/',1+48,'\0','\0'};
	
    if(lecNo>9){
      lecture[6]=(lecNo-10)+48;
    }else{
      lecture[5]=lecNo+48;
    }

    Serial.print("Path:");
    Serial.printf("%s",lecture);
    Serial.println();
    Serial.printf("NTP Time: %d:%d",timeClient.getHours(),timeClient.getMinutes());
    Serial.println();


    if(Firebase.RTDB.getString(&fbdo, lecture)){
      Serial.printf("Data in Firebase object:%s",fbdo.to<const char *>());
      String lecData=fbdo.to<String>();

      char lecArr[lecData.length() + 1];  

      strcpy(lecArr, lecData.c_str()); 
      Serial.println();

      Display.displayClear();   
      Display.print(lecArr);
	  
      digitalWrite(LED_BUILTIN, LOW);
      delay(500);
      digitalWrite(LED_BUILTIN, HIGH);
      
    }else{
      Serial.printf("%s\n",fbdo.errorReason().c_str());
      ESP.restart();
    }

    sendDataPrevMillis = millis();
  
  }
}
