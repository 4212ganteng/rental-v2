javascript```
const year = new Date().getFullYear().toString();
const month = (new Date().getMonth() + 1).toString();
const date = new Date().getDate().toString();

transaction_id:
`INV/${
                    year +
                    (month.length > 1 ? month : "0" + month) +
                    (date.length > 1 ? date : "0" + date)
                }/PS/` +
(Math.floor(Math.random() \* 1000000) + 1000000),

```
Code tersebut adalah untuk membuat sebuah transaction_id (ID transaksi) dengan format tertentu menggunakan tanggal dan waktu saat ini serta nomor acak.

new Date().getFullYear().toString() digunakan untuk mendapatkan tahun saat ini (dalam bentuk string).
new Date().getMonth() + 1 digunakan untuk mendapatkan bulan saat ini (dimulai dari 0, maka perlu ditambah 1) dalam bentuk number.
new Date().getDate().toString() digunakan untuk mendapatkan tanggal saat ini dalam bentuk string.
(month.length > 1 ? month : "0" + month) digunakan untuk menambahkan angka 0 pada bulan jika bulannya hanya satu digit (misalnya 5 menjadi 05).
(date.length > 1 ? date : "0" + date) digunakan untuk menambahkan angka 0 pada tanggal jika tanggalnya hanya satu digit (misalnya 9 menjadi 09).
(Math.floor(Math.random() * 1000000) + 1000000) digunakan untuk menghasilkan nomor acak antara 1.000.000 dan 1.999.999 (dalam bentuk number).
Kemudian, gabungan dari semua elemen tersebut digunakan untuk membentuk transaction_id dengan format INV/YYYYMMDD/PS/XXXXXXX, dimana:

INV adalah prefix yang menunjukkan bahwa ini adalah invoice.
YYYYMMDD adalah tahun, bulan, dan tanggal saat ini dengan format YYYYMMDD.
PS adalah singkatan dari penjual (seller).
XXXXXXX adalah nomor acak antara 1.000.000 dan 1.999.999 dalam bentuk string.
Contoh hasil akhir dari kode tersebut bisa seperti ini: INV/20220329/PS/1358207 yang menunjukkan bahwa ini adalah invoice untuk transaksi pada tanggal 29 Maret 2023 dengan nomor acak 1358207 dan penjualnya adalah PS.
```

/////////automate count total
Pada contoh di atas, pre-save middleware yang dijalankan akan mengambil nilai pemakaian dan tagihan pada dokumen Tagihan dan menambahkan nilai tersebut ke dalam field totalPakai dan totalTagihan masing-masing. Setelah itu, middleware akan memanggil fungsi next() untuk melanjutkan proses penyimpanan dokumen ke database. Dengan begitu, setiap kali ada data inputan/create, nilai total akan dihitung secara otomatis dan disimpan ke dalam field totalTagihan.
