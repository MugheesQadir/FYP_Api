package com.iotbasedsmarthomefinalscreens

import android.app.Service
import android.content.Intent
import android.os.IBinder
import java.net.HttpURLConnection
import java.net.URL
import java.util.Timer
import java.util.TimerTask

class BackgroundService : Service() {

    private var timer: Timer? = null
    private var timerTask: TimerTask? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        timer = Timer()
        timerTask = object : TimerTask() {
            override fun run() {
                try {
                    val url = URL("http://192.168.222.116:5000/check_schedule_update_status")
                    val conn = url.openConnection() as HttpURLConnection
                    conn.requestMethod = "GET"
                    val responseCode = conn.responseCode
                    println("Response: $responseCode")
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
        timer?.scheduleAtFixedRate(timerTask, 0, 1000) // 1 second
        return START_STICKY
    }

    override fun onDestroy() {
        timer?.cancel()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
