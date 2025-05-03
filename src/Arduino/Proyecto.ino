#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // Reemplaza con la dirección I2C de tu LCD

const int bufferSize = 32; // Define el tamaño máximo de la cadena a recibir
char receivedBuffer[bufferSize]; // Array para almacenar los caracteres recibidos
byte bufferIndex = 0;        // Índice para rastrear la posición en el buffer

void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);
  lcd.init();
  lcd.backlight();
  lcd.print("Esperando texto...");
}

void loop() {
  if (Serial1.available() > 0) {
    char receivedChar = Serial1.read();

    if (receivedChar != '\n' && bufferIndex < bufferSize - 1) {
      // Si el carácter no es un salto de línea y hay espacio en el buffer, lo agregamos
      receivedBuffer[bufferIndex++] = receivedChar;
    } else if (receivedChar == '\n') {
      // Si recibimos un salto de línea, significa el final del mensaje
      receivedBuffer[bufferIndex] = '\0'; // Terminamos la cadena con un carácter nulo
      Serial.print("Cadena recibida: ");
      Serial.println(receivedBuffer);

      lcd.clear();
      lcd.print("Recibido:");
      lcd.setCursor(0, 1);
      lcd.print(receivedBuffer);

      bufferIndex = 0; // Reiniciamos el índice del buffer para el próximo mensaje
    }
    // Si el buffer está lleno y no se ha recibido un salto de línea, podríamos ignorar el resto
    // o implementar una lógica para manejar cadenas más largas (scrolling, etc.)
  }
}