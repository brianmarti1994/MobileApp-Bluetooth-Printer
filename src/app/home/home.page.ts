import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  bluetoothList:any=[];
  selectedPrinter:any;
  constructor(private btSerial: BluetoothSerial) {
   this.listPrinter()
  }




 //This will list all of your bluetooth devices
 listPrinter() { 
  
  this.searchBluetoothPrinter()
   .then(resp=>{

    //List of bluetooth device list
    this.bluetoothList=resp;
});
}

//This will store selected bluetooth device mac address
selectPrinter(macAddress)
{
  //Selected printer macAddress stored here
  this.selectedPrinter=macAddress;
}

//This will print
printStuff()
{  
   //The text that you want to print
   let title = "Receipt";
    let revenue = 1000;
    let company = "Aspire Software";
    
  let receipt = '';    
  receipt += commands.HARDWARE.HW_INIT;
      receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += title.toUpperCase()
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_NORMAL;
      receipt += commands.HORIZONTAL_LINE.HR_58MM;
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
      receipt += company.toUpperCase()
      receipt += commands.EOL;
      receipt += commands.HORIZONTAL_LINE.HR2_58MM;
      receipt += commands.EOL;
      receipt += commands.EOL;
      receipt += commands.EOL;
      receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
      //This line here
      receipt += "Total Revenue: "+ revenue;
      receipt += commands.EOL;
      receipt += commands.EOL;
      receipt += commands.EOL;

   this.sendToBluetoothPrinter(this.selectedPrinter,receipt);
}


  searchBluetoothPrinter()
  {
  //This will return a list of bluetooth devices
 
     return this.btSerial.list(); 
  }
  connectToBluetoothPrinter(macAddress)
  {
  //This will connect to bluetooth printer via the mac address provided
     return this.btSerial.connect(macAddress)
  }
  disconnectBluetoothPrinter()
  {
  //This will disconnect the current bluetooth connection
     return this.btSerial.disconnect();
  }
  //macAddress->the device's mac address 
  //data_string-> string to be printer
  sendToBluetoothPrinter(macAddress,data_string)
  {
     //1. Try connecting to bluetooth printer
     this.connectToBluetoothPrinter(macAddress)
     .subscribe(_=>{
        //2. Connected successfully
        this.btSerial.write(data_string)
        .then(_=>{
         //3. Print successful
         //If you want to tell user print is successful,
         //handle it here
         //4. IMPORTANT! Disconnect bluetooth after printing
         this.disconnectBluetoothPrinter()
         },err=>{
           //If there is an error printing to bluetooth printer
           //handle it here
         })
     },err=>{
       
       //If there is an error connecting to bluetooth printer
       //handle it here
     })
  }
  


}
export const commands = {
  LF: '\x0a',
  ESC: '\x1b',
  FS: '\x1c',
  GS: '\x1d',
  US: '\x1f',
  FF: '\x0c',
  DLE: '\x10',
  DC1: '\x11',
  DC4: '\x14',
  EOT: '\x04',
  NUL: '\x00',
  EOL: '\n',
  HORIZONTAL_LINE: {
    HR_58MM: '================================',
    HR2_58MM: '********************************'
  },
  FEED_CONTROL_SEQUENCES: {
    CTL_LF: '\x0a', // Print and line feed
    CTL_FF: '\x0c', // Form feed
    CTL_CR: '\x0d', // Carriage return
    CTL_HT: '\x09', // Horizontal tab
    CTL_VT: '\x0b', // Vertical tab
  },
  LINE_SPACING: {
    LS_DEFAULT: '\x1b\x32',
    LS_SET: '\x1b\x33'
  },
  HARDWARE: {
    HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes
    HW_SELECT: '\x1b\x3d\x01', // Printer select
    HW_RESET: '\x1b\x3f\x0a\x00', // Reset printer hardware
  },
  CASH_DRAWER: {
    CD_KICK_2: '\x1b\x70\x00', // Sends a pulse to pin 2 []
    CD_KICK_5: '\x1b\x70\x01', // Sends a pulse to pin 5 []
  },
  MARGINS: {
    BOTTOM: '\x1b\x4f', // Fix bottom size
    LEFT: '\x1b\x6c', // Fix left size
    RIGHT: '\x1b\x51', // Fix right size
  },
  PAPER: {
    PAPER_FULL_CUT: '\x1d\x56\x00', // Full cut paper
    PAPER_PART_CUT: '\x1d\x56\x01', // Partial cut paper
    PAPER_CUT_A: '\x1d\x56\x41', // Partial cut paper
    PAPER_CUT_B: '\x1d\x56\x42', // Partial cut paper
  },
  TEXT_FORMAT: {
    TXT_NORMAL: '\x1b\x21\x00', // Normal text
    TXT_2HEIGHT: '\x1b\x21\x10', // Double height text
    TXT_2WIDTH: '\x1b\x21\x20', // Double width text
    TXT_4SQUARE: '\x1b\x21\x30', // Double width & height text
    TXT_CUSTOM_SIZE: function (width, height) { // other sizes
      var widthDec = (width - 1) * 16;
      var heightDec = height - 1;
      var sizeDec = widthDec + heightDec;
      return '\x1d\x21' + String.fromCharCode(sizeDec);
    },

    TXT_HEIGHT: {
      1: '\x00',
      2: '\x01',
      3: '\x02',
      4: '\x03',
      5: '\x04',
      6: '\x05',
      7: '\x06',
      8: '\x07'
    },
    TXT_WIDTH: {
      1: '\x00',
      2: '\x10',
      3: '\x20',
      4: '\x30',
      5: '\x40',
      6: '\x50',
      7: '\x60',
      8: '\x70'
    },

    TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
    TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
    TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
    TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
    TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON
    TXT_ITALIC_OFF: '\x1b\x35', // Italic font ON
    TXT_ITALIC_ON: '\x1b\x34', // Italic font ON
    TXT_FONT_A: '\x1b\x4d\x00', // Font type A
    TXT_FONT_B: '\x1b\x4d\x01', // Font type B
    TXT_FONT_C: '\x1b\x4d\x02', // Font type C
    TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
    TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
    TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
  }
}