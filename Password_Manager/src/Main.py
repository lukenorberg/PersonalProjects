"""
program designed for authenticating a user for entrance into a password manager
that also contains a password generator and a form filler.
"""

import csv
import random
import pandas as pd
import pyperclip
from tkinter import *
from tkinter import ttk
import tkinter.messagebox

isOn = True


# "closes" tabs
def destroyPage():
    for i, widget in enumerate(root.winfo_children()):
        if i > 2:
            widget.destroy()

# authorizes users
def auth():
    def testPasswords():
        master_password = "test"
        if password.get() != master_password:
            mainText.config(text="Try Again", foreground="red")
            password.delete(0, 'end')
        else:
            mainText.config(text="Access Granted", foreground="green")
            for widget in (root.winfo_children()):
                widget.destroy()
            homePage()

    def seePassword():
        global isOn
        if isOn:
            password.config(show="")
            isOn = False
        else:
            password.config(show="*")
            isOn = True

    #Design of the GUIs

    mainText = ttk.Label(root, text="Please enter your password", font=('arial', 12), background="gray",
                         foreground="white")
    mainText.place(relx=0.5, rely=0.42, anchor=CENTER)
    password = Entry(root, show="*", width=30, font=('arial', 12), )
    password.place(relx=0.5, rely=0.5, anchor=CENTER)
    seePasswordBtn = ttk.Button(root, text="See/Unsee Password", command=seePassword)
    seePasswordBtn.place(relx=0.75, rely=0.5, anchor=CENTER)
    submitBtn = ttk.Button(root, text="Submit", command=testPasswords)

    submitBtn.place(relx=0.5, rely=0.55, anchor=CENTER)


def homePage():
    f1 = Button(root, text="Passwords", command=f1Page)
    f2 = Button(root, text="Password Generator", command=f2Page)
    f3 = Button(root, text="Form Filler")
    f1.place(relx=0.38, rely=0, anchor="n")
    f2.place(relx=0.5, rely=0, anchor="n")
    f3.place(relx=0.625, rely=0, anchor="n")


def f1Page():

    # opens up a second window used for saving login info
    
    def deletePassword():
        for i in listbox.curselection():
            pdIndex = pandasLogin.loc[pandasLogin.Name == listbox.get(i)].index
            listbox.delete(i)
            pandasLogin.drop(index=pdIndex[0], axis=2, inplace=True)
            pandasLogin.to_csv('Login.csv', index=False)
            print(pandasLogin)

    # list where site names are displayed

    def bindList():
        for values in namesList:
            listbox.insert(END, values)
        listbox.bind('<Double-1>', loginOpen)
        listbox.config(yscrollcommand=scrollbar.set)
        scrollbar.config(command=listbox.yview)
        searchBar.bind("<Key>", click)

    # creates and arranges searchbar that updates in real time

    def click(*args):
        text.get()
        listbox.delete(0, END)
        for values in namesList:
            if values[0:len(searchBar.get())].lower() == searchBar.get().lower():
                listbox.insert(END, values)
        return True

    # opens a window to add new login information

    def secondWindowOpen():

        def saveButton():
            nameUsernamePassword = [nameEntry.get(), usernameEntry.get(), passwordEntry.get()]
            for i in nameUsernamePassword:
                if i == "":
                    tkinter.messagebox.showinfo("info", "Please fill out all three boxes.", parent=top)
                    break
            # updates csv and pandas library
            with open('Login.csv', mode='a') as file:
                csvwriter = csv.writer(file)
                csvwriter.writerow(nameUsernamePassword)
            listbox.insert(END, nameEntry.get())
            pandasLogin.loc[len(pandasLogin.index)] = nameUsernamePassword
            tkinter.messagebox.showinfo("info", "Successfully saved", parent=top)
            print(pandasLogin)
            top.destroy()

        # creates and arranges GUI's for new window

        top = Toplevel()
        top.title("Log-in Information")
        top.config(width=500, height=400)

        name = Label(top, text='Name:')
        username = Label(top, text='Username:')
        usernamePassword = Label(top, text='Password:')
        saveLogin = Button(top, text="Save Login", command=saveButton)
        nameEntry = Entry(top, width=30)
        usernameEntry = Entry(top, width=30)
        passwordEntry = Entry(top, width=30)

        name.place(relx=0.1, rely=0.1, anchor='center')
        username.place(relx=0.1, rely=0.2, anchor='center')
        usernamePassword.place(relx=0.1, rely=0.3, anchor='center')
        saveLogin.place(relx=0.47, rely=0.5, anchor='center')
        nameEntry.place(relx=0.36, rely=0.1, anchor='center')
        usernameEntry.place(relx=0.36, rely=0.2, anchor='center')
        passwordEntry.place(relx=0.36, rely=0.3, anchor='center')

    # allows the user to update login information

    def loginOpen(event):

        def updatePandas():
            pandasLogin.iloc[cs, pandasLogin.columns.get_loc('Name')] = nameEntry.get()
            pandasLogin.iloc[cs, pandasLogin.columns.get_loc('Username')] = usernameEntry.get()
            pandasLogin.iloc[cs, pandasLogin.columns.get_loc('Password')] = passwordEntry.get()
            pandasLogin.to_csv("Login.csv", index=False)
            tkinter.messagebox.showinfo("info", "Successfully Updated", parent=top)
            top.destroy()

        def copyPassword():
            pyperclip.copy(passwordEntry.get())

        # locates and updates the pandas information

        cs = listbox.curselection()[0]
        savedName = pandasLogin.iloc[cs, 0]
        savedUsername = pandasLogin.iloc[cs, 1]
        savedPassword = pandasLogin.iloc[cs, 2]

        # creates and arranges GUI's for new window

        top = Toplevel()
        top.title("Log-in Information")
        top.config(width=500, height=400)

        name = Label(top, text='Name:')
        username = Label(top, text='Username:')
        usernamePassword = Label(top, text='Password:')
        saveLogin = Button(top, text="Save New Info", command=updatePandas)
        copyPassword = Button(top, text="Copy Password", command=copyPassword)
        nameEntry = Entry(top, width=30)
        usernameEntry = Entry(top, width=30)
        passwordEntry = Entry(top, width=30, show='*')
        nameEntry.insert(0, savedName)
        usernameEntry.insert(0, savedUsername)
        passwordEntry.insert(0, savedPassword)

        name.place(relx=0.1, rely=0.1, anchor='center')
        username.place(relx=0.1, rely=0.2, anchor='center')
        usernamePassword.place(relx=0.1, rely=0.3, anchor='center')
        saveLogin.place(relx=0.23, rely=0.5, anchor='center')
        copyPassword.place(relx=0.47, rely=0.5, anchor='center')
        nameEntry.place(relx=0.36, rely=0.1, anchor='center')
        usernameEntry.place(relx=0.36, rely=0.2, anchor='center')
        passwordEntry.place(relx=0.36, rely=0.3, anchor='center')

    text = StringVar()
    text.trace_add("write", click)

    destroyPage()
    frame1 = Frame(root, width=500, height=300, relief="sunken", borderwidth=1)
    frame1.place(relx=0.5, rely=0.1, anchor='n')
    scrollbar = ttk.Scrollbar(root, orient='vertical')
    searchBar = ttk.Entry(width=40, textvariable=text)
    listbox = Listbox(root, width=25, selectmode=EXTENDED)
    addButton = Button(text="Add New Login", command=secondWindowOpen)
    deleteButton = Button(text="Delete", command=deletePassword)

    pandasLogin = pd.read_csv("Login.csv")
    namesList = pandasLogin['Name']

    bindList()

    scrollbar.place(relx=0.6, rely=0.27, anchor='center')
    listbox.place(relx=0.5, rely=0.35, anchor='center')
    searchBar.place(relx=0.5, rely=0.16, anchor='center')
    addButton.place(relx=0.465, rely=0.54, anchor='center')
    deleteButton.place(relx=0.56, rely=0.54, anchor='center')


def f2Page():

    # creates and arranges a password generator

    destroyPage()
    CAPS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    LOWER = list("abcdefghijklmnopqrstuvwxyz")
    NUMS = list("1234567890")
    CHARS = list("!@#$%^&*(),.<>/?;:'-_=+|")

    charsSelectedOptions = []
    charsWanted = []

    # allows user to select what type of characters they want

    def capsSelected():
        charsSelectedOptions.extend(CAPS)

    def lowersSelected():
        charsSelectedOptions.extend(LOWER)

    def numsSelected():
        charsSelectedOptions.extend(NUMS)

    def charsSelected():
        charsSelectedOptions.extend(CHARS)

    def finalPasswordGen():
        try:
            shownPassword.delete(0, END)
            final_password = ""
            # selects value from the scale as the number of characters for the password
            for num in range(int(charScale.get())):
                len_of_list = len(charsSelectedOptions)
                random_character = random.randint(0, len_of_list) - 1
                final_password += charsSelectedOptions[random_character]
            shownPassword.insert(END, final_password)
        except:
            tkinter.messagebox.showerror(title="error", message="Please select at least one checkbox.")

    def copyPassword():
        pyperclip.copy(shownPassword.get())

    # creates and arranges GUI's for new window

    frame1 = Frame(root, width=500, height=300, relief="sunken", borderwidth=1)
    frame1.place(relx=0.5, rely=0.1, anchor='n')
    capCheckBox = Checkbutton(root, text="Capital Letters", command=capsSelected)
    lowerCheckBox = Checkbutton(root, text="Lowercase Letters", command=lowersSelected)
    numCheckBox = Checkbutton(root, text="Numbers", command=numsSelected)
    specialCheckBox = Checkbutton(root, text="Special Characters", command=charsSelected)
    charScale = Scale(root, from_=0, to=30, tickinterval=30, orient=HORIZONTAL, length=200)
    charScale.set(12)
    generate = ttk.Button(root, text="Generate", command=finalPasswordGen)
    copy2Clipboard = ttk.Button(root, text="Copy to Clipboard", command=copyPassword)
    shownPassword = ttk.Entry(root, width=60)
    numOfChars = ttk.Label(root)

    capCheckBox.place(relx=0.4, rely=0.5, anchor='center')
    lowerCheckBox.place(relx=0.6, rely=0.5, anchor='center')
    numCheckBox.place(relx=0.4, rely=0.55, anchor='center')
    specialCheckBox.place(relx=0.6, rely=0.55, anchor='center')
    charScale.place(relx=0.5, rely=0.43, anchor='center')
    generate.place(relx=0.43, rely=0.33, anchor='center')
    copy2Clipboard.place(relx=0.57, rely=0.33, anchor='center')
    shownPassword.place(relx=0.5, rely=0.25, anchor='center')
    numOfChars.place(relx=0.63, rely=0.43, anchor='center')


root = Tk()
root.title("PassProtect")
root.geometry("900x600")
root.configure(bg="#ffffff")
auth()

root.mainloop()
