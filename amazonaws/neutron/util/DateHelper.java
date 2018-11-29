package com.amazonaws.neutron.util;

import java.util.Calendar;

public class DateHelper {
	int year, month, date;
	
	public DateHelper() {
		
	}
	
	public DateHelper(int year, int month, int date) {
		// TODO Auto-generated constructor stub
		this.year = year;
		this.month = month;
		this.date = date;
	}
	
	public boolean after(DateHelper d) {
		if (this.year > d.year) {
			return true;
		}
		if (this.year < d.year){
			return false;
		}
		// this.year == d.year
		if (this.month > d.month) {
			return true;
		}
		if (this.month < d.month) {
			return false;
		}
		// this.month == d.month
		if (this.date > d.date) {
			return true;
		}
		return false;
	}
	
	public boolean equals(DateHelper d) {
		if (this.year == d.year && this.month == d.month && this.date == d.date) {
			return true;
		}
		return false;
	}
	
	public void addDate(int d) {
		Calendar c = Calendar.getInstance();
		c.set(year, month - 1, date);
		c.add(Calendar.DATE, d);
		this.year = c.get(Calendar.YEAR);
		this.month = c.get(Calendar.MONTH) + 1;
		this.date = c.get(Calendar.DATE);
	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		String s = "";
		s += year + "-";
		if (month < 10) {
			s += "0" + month + "-";
		}
		else {
			s += month + "-";
		}
		if(date < 10) {
			s += "0" + date;
		}
		else {
			s += date;
		}
		return s;
	}
}
