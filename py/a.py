from pynput.mouse import Listener, Button
import time as t
import pyautogui as p
import os
f=0
mdt=0
mdl=0
def on_click(x, y, button, is_press):
    global start_time,mdt,mdl,f
    if button == Button.right:
        print("點選右鍵，停止監控")
        return False
    if(f<=1):
        start_time=t.time()
        f+=1
    elif(is_press):
        mdt=t.time()-start_time
        mdl=t.time()
    elif(is_press==0):
        print(t.time()-mdl,mdt-0.005)
        start_time=t.time()

start_time=t.time()

p.hotkey("win","7")
with Listener(
    on_click=on_click
) as listener:
    listener.join()
